import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useTasks, useCreateTask, useReorderTasks, useDeleteTask } from "../hooks/useQueries";
import type { TaskData } from "../hooks/useQueries";

const columnOrder = ["ideas", "scripting", "filming", "editing", "published"];

const columnTitles: Record<string, string> = {
    ideas: "Ideas 💡",
    scripting: "Scripting ✍️",
    filming: "Filming 🎥",
    editing: "Editing ✂️",
    published: "Live 🚀"
}

// Helper: map flattened tasks array to column dict map
const mapTasksToColumns = (tasks: TaskData[]) => {
    const initialCols: any = {};
    columnOrder.forEach(col => {
        initialCols[col] = { id: col, title: columnTitles[col], tasks: [] }
    });

    // Ensure they are ordered properly by their saved index
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

    sortedTasks.forEach(task => {
        if (initialCols[task.status]) {
            initialCols[task.status].tasks.push(task);
        }
    });
    return initialCols;
};

const ProductionBoard = () => {
    const { data: serverTasks, isLoading } = useTasks();
    const { mutate: createTask } = useCreateTask();
    const { mutate: reorderTasks } = useReorderTasks();
    const { mutate: deleteTask } = useDeleteTask();

    const [columns, setColumns] = useState<any>(null);
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskTag, setNewTaskTag] = useState("Draft");
    const [isAddingTaskTo, setIsAddingTaskTo] = useState<string | null>(null);

    // Sync server tasks to local columns state when loaded
    useEffect(() => {
        if (serverTasks) {
            setColumns(mapTasksToColumns(serverTasks));
        }
    }, [serverTasks]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;
        if (!destination || !columns) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // We do an optimistic UI update
        const startColumn = columns[source.droppableId];
        const finishColumn = columns[destination.droppableId];
        const newColumns = { ...columns };

        let tasksToUpdate: { _id: string, status: string, order: number }[] = [];

        if (startColumn === finishColumn) {
            const newTasks = Array.from(startColumn.tasks);
            const [movedTask] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, movedTask);
            newColumns[startColumn.id].tasks = newTasks;

            // Update their order indexing 
            tasksToUpdate = newTasks.map((t: any, idx: number) => ({ _id: t._id, status: startColumn.id, order: idx }));
        } else {
            const startTasks = Array.from(startColumn.tasks);
            const [movedTask] = startTasks.splice(source.index, 1);
            const finishTasks = Array.from(finishColumn.tasks);
            finishTasks.splice(destination.index, 0, movedTask);

            newColumns[startColumn.id].tasks = startTasks;
            newColumns[finishColumn.id].tasks = finishTasks;

            // Update both columns for safety index ranges
            tasksToUpdate = [
                ...startTasks.map((t: any, idx: number) => ({ _id: t._id, status: startColumn.id, order: idx })),
                ...finishTasks.map((t: any, idx: number) => ({ _id: t._id, status: finishColumn.id, order: idx }))
            ];
        }

        setColumns(newColumns);
        reorderTasks(tasksToUpdate);
    };

    const handleAddTask = (columnId: string) => {
        if (!newTaskText.trim()) {
            setIsAddingTaskTo(null);
            return;
        }

        // Mutation push
        createTask({
            content: newTaskText,
            status: columnId,
            tag: newTaskTag
        });

        setNewTaskText("");
        setNewTaskTag("Draft");
        setIsAddingTaskTo(null);
    };

    if (isLoading || !columns) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--primary)" }}>
                <p>Loading Workspace...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header animate-slide-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Production Kanban</h1>
                        <p className="page-subtitle">Visually manage your video workflow from ideation to publishing.</p>
                    </div>
                    {/* Can drop filters here in future updates */}
                </div>
            </div>

            <div className="kanban-board animate-fade-in stagger-2">
                <DragDropContext onDragEnd={onDragEnd}>
                    {columnOrder.map((columnId) => {
                        const column = columns[columnId];
                        return (
                            <div key={column.id} className="kanban-column">
                                <div className="kanban-header">
                                    <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>
                                        {column.title} <span style={{ color: "var(--text-muted)", marginLeft: "4px" }}>({column.tasks.length})</span>
                                    </span>
                                    <button className="btn-secondary" style={{ padding: "4px", border: "none", background: "none" }} onClick={() => setIsAddingTaskTo(column.id)}>
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <div
                                            className="kanban-list"
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {column.tasks.map((task: any, index: number) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className="kanban-card group"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                borderColor: snapshot.isDragging ? "var(--primary)" : "var(--border)",
                                                                boxShadow: snapshot.isDragging ? "0 15px 30px rgba(0,0,0,0.5)" : "none",
                                                                opacity: snapshot.isDragging ? 0.9 : 1,
                                                            }}
                                                        >
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                                                <span style={{
                                                                    fontSize: "10px",
                                                                    background: task.tag === 'Urgent' ? 'rgba(239, 68, 68, 0.2)' : task.tag === 'Sponsor' ? 'rgba(139, 92, 246, 0.2)' : task.tag === 'Research' ? 'rgba(59, 130, 246, 0.2)' : 'var(--primary)',
                                                                    color: task.tag === 'Urgent' ? '#ef4444' : task.tag === 'Sponsor' ? '#a78bfa' : task.tag === 'Research' ? '#60a5fa' : 'var(--primary-text)',
                                                                    fontWeight: "600",
                                                                    padding: "2px 6px",
                                                                    borderRadius: "4px",
                                                                }}>
                                                                    {task.tag}
                                                                </span>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                                    <button
                                                                        onClick={() => deleteTask(task._id)}
                                                                        style={{ background: "none", border: "none", color: "var(--danger)", opacity: 0.6, cursor: "pointer", padding: 0 }}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                    <GripVertical size={14} color="var(--text-muted)" style={{ cursor: "grab" }} />
                                                                </div>
                                                            </div>
                                                            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-main)", fontWeight: "500", lineHeight: "1.4" }}>
                                                                {task.content}
                                                            </p>
                                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", alignItems: "center" }}>
                                                                <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                                                                    {new Date(task.createdAt).toLocaleDateString()}
                                                                </span>
                                                                <div style={{
                                                                    width: "20px", height: "20px", borderRadius: "50%",
                                                                    background: "var(--accent)", color: "white",
                                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                                    fontSize: "10px", fontWeight: "bold"
                                                                }}>
                                                                    Me
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {isAddingTaskTo === column.id && (
                                                <div className="kanban-card" style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                                    <input
                                                        autoFocus
                                                        className="input-field"
                                                        style={{ background: "transparent", border: "none", padding: "4px" }}
                                                        placeholder="Type your task..."
                                                        value={newTaskText}
                                                        onChange={(e) => setNewTaskText(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleAddTask(column.id);
                                                            if (e.key === 'Escape') setIsAddingTaskTo(null);
                                                        }}
                                                    />
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <select
                                                            value={newTaskTag}
                                                            onChange={(e) => setNewTaskTag(e.target.value)}
                                                            style={{
                                                                background: "var(--background-card-hover)",
                                                                color: "var(--text-main)",
                                                                border: "1px solid var(--border)",
                                                                padding: "4px",
                                                                borderRadius: "4px",
                                                                fontSize: "11px",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            <option value="Draft">Draft</option>
                                                            <option value="Research">Research</option>
                                                            <option value="Urgent">Urgent</option>
                                                            <option value="Sponsor">Sponsor</option>
                                                        </select>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddTask(column.id);
                                                            }}
                                                            style={{ background: "var(--primary)", border: "none", color: "var(--primary-text)", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </DragDropContext>
            </div>
        </div>
    );
};

export default ProductionBoard;
