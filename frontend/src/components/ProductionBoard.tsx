import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2, X, CheckSquare, FileText, CheckCircle2, Circle } from "lucide-react";
import { useTasks, useCreateTask, useReorderTasks, useDeleteTask, useUpdateTask } from "../hooks/useQueries";
import type { TaskData } from "../hooks/useQueries";
import { v4 as uuidv4 } from 'uuid';

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
    const { mutate: updateTask } = useUpdateTask();

    const [columns, setColumns] = useState<any>(null);
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskTag, setNewTaskTag] = useState("Draft");
    const [isAddingTaskTo, setIsAddingTaskTo] = useState<string | null>(null);

    // Modal state overrides
    const [activeTask, setActiveTask] = useState<TaskData | null>(null);
    const [modalScript, setModalScript] = useState("");
    const [modalSubtasks, setModalSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
    const [modalContent, setModalContent] = useState("");
    const [modalTag, setModalTag] = useState("Draft");
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
    const [activeTab, setActiveTab] = useState<"script" | "subtasks">("script");

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

        // Optimistic UI push
        const optimisticTask = {
            _id: `temp-${Date.now()}`,
            content: newTaskText,
            status: columnId,
            tag: newTaskTag,
            order: columns[columnId].tasks.length,
            createdAt: new Date().toISOString()
        };

        setColumns((prev: any) => {
            if (!prev) return prev;
            return {
                ...prev,
                [columnId]: {
                    ...prev[columnId],
                    tasks: [...prev[columnId].tasks, optimisticTask]
                }
            };
        });

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

    const openTaskModal = (task: TaskData) => {
        setActiveTask(task);
        setModalScript(task.script || "");
        setModalSubtasks(task.subtasks || []);
        setModalContent(task.content);
        setModalTag(task.tag);
        setActiveTab("script");
    };

    const closeTaskModal = () => {
        if (!activeTask) return;
        updateTask({
            id: activeTask._id,
            data: {
                content: modalContent,
                tag: modalTag,
                script: modalScript,
                subtasks: modalSubtasks
            }
        });

        // Optimistic UI for edit
        setColumns((prev: any) => {
            if (!prev) return prev;
            const newCols = { ...prev };
            const col = newCols[activeTask.status];
            if (col) {
                col.tasks = col.tasks.map((t: any) => t._id === activeTask._id ? { ...t, content: modalContent, tag: modalTag, script: modalScript, subtasks: modalSubtasks } : t);
            }
            return newCols;
        });

        setActiveTask(null);
    };

    const handleAddSubtask = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSubtaskTitle.trim()) {
            setModalSubtasks([...modalSubtasks, { id: uuidv4(), title: newSubtaskTitle, completed: false }]);
            setNewSubtaskTitle("");
        }
    };

    const toggleSubtask = (id: string) => {
        setModalSubtasks(modalSubtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
    };

    const deleteSubtask = (id: string) => {
        if (window.confirm("Are you sure you want to delete this subtask?")) {
            setModalSubtasks(modalSubtasks.filter(st => st.id !== id));
        }
    };

    const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(taskId);
        }
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
                                                            onClick={() => openTaskModal(task)}
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
                                                                        onClick={(e) => handleDeleteTask(e, task._id)}
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

            {/* Task Extended Editor Modal */}
            {activeTask && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
                }} onClick={closeTaskModal}>
                    <div
                        className="card animate-fade-in"
                        style={{ width: "90%", maxWidth: "800px", height: "85vh", display: "flex", flexDirection: "column", padding: "0" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, marginRight: "20px" }}>
                                <select
                                    value={modalTag}
                                    onChange={(e) => setModalTag(e.target.value)}
                                    style={{
                                        background: modalTag === 'Urgent' ? 'rgba(239, 68, 68, 0.2)' : modalTag === 'Sponsor' ? 'rgba(139, 92, 246, 0.2)' : modalTag === 'Research' ? 'rgba(59, 130, 246, 0.2)' : 'var(--primary)',
                                        color: modalTag === 'Urgent' ? '#ef4444' : modalTag === 'Sponsor' ? '#a78bfa' : modalTag === 'Research' ? '#60a5fa' : 'var(--primary-text)',
                                        border: "none",
                                        fontWeight: "600",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        outline: "none"
                                    }}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Research">Research</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Sponsor">Sponsor</option>
                                </select>
                                <input
                                    value={modalContent}
                                    onChange={(e) => setModalContent(e.target.value)}
                                    autoFocus
                                    style={{
                                        background: "transparent", border: "none", fontSize: "20px", fontWeight: "bold",
                                        color: "var(--text-main)", outline: "none", flex: 1
                                    }}
                                    placeholder="Task Title..."
                                />
                            </div>
                            <button onClick={closeTaskModal} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>
                            <button
                                onClick={() => setActiveTab("script")}
                                style={{
                                    flex: 1, padding: "16px", background: "none", border: "none",
                                    color: activeTab === "script" ? "var(--primary)" : "var(--text-muted)",
                                    borderBottom: activeTab === "script" ? "2px solid var(--primary)" : "2px solid transparent",
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "600"
                                }}
                            >
                                <FileText size={18} /> Script & Notes
                            </button>
                            <button
                                onClick={() => setActiveTab("subtasks")}
                                style={{
                                    flex: 1, padding: "16px", background: "none", border: "none",
                                    color: activeTab === "subtasks" ? "var(--primary)" : "var(--text-muted)",
                                    borderBottom: activeTab === "subtasks" ? "2px solid var(--primary)" : "2px solid transparent",
                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "600"
                                }}
                            >
                                <CheckSquare size={18} /> Subtasks Checklist
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
                            {activeTab === "script" ? (
                                <textarea
                                    style={{
                                        width: "100%", height: "100%", padding: "24px",
                                        background: "transparent", border: "none", outline: "none",
                                        color: "var(--text-main)", fontSize: "15px", lineHeight: "1.6",
                                        resize: "none"
                                    }}
                                    placeholder="Write your video script, ideas, and rich notes here..."
                                    value={modalScript}
                                    onChange={(e) => setModalScript(e.target.value)}
                                />
                            ) : (
                                <div style={{ padding: "24px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                                        <input
                                            className="input-field"
                                            style={{ flex: 1 }}
                                            placeholder="Add subtask and hit Enter..."
                                            value={newSubtaskTitle}
                                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                            onKeyDown={handleAddSubtask}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {modalSubtasks.map((st) => (
                                            <div key={st.id} style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px",
                                                border: "1px solid var(--border)", opacity: st.completed ? 0.6 : 1
                                            }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => toggleSubtask(st.id)}>
                                                    {st.completed ? <CheckCircle2 size={20} color="var(--primary)" /> : <Circle size={20} color="var(--text-muted)" />}
                                                    <span style={{ fontSize: "15px", textDecoration: st.completed ? "line-through" : "none" }}>{st.title}</span>
                                                </div>
                                                <button onClick={() => deleteSubtask(st.id)} style={{ background: "none", border: "none", color: "var(--danger)", opacity: 0.6, cursor: "pointer" }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionBoard;
