import { useState } from "react";
import { Play, Plus, Video } from "lucide-react";
import { useUploadVideo, useVideos } from "../hooks/useQueries";

const VideoManager = () => {
    const { data: videos = [], isLoading: loading } = useVideos();
    const { mutate: uploadVideo } = useUploadVideo();

    // For uploading demo
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !url) return;

        uploadVideo(
            {
                title,
                url,
                description,
                user: "6472b535d4f3b890982abcd1" // Mock Object ID for user
            },
            {
                onSuccess: () => {
                    setTitle("");
                    setUrl("");
                    setDescription("");
                },
                onError: (error) => {
                    console.error("Upload failed", error);
                }
            }
        );
    };

    return (
        <div>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <h1 className="page-title">Video Manager</h1>
                    <p className="page-subtitle">Track and manage all your influencer content.</p>
                </div>
            </div>

            <div className="responsive-grid-split">
                {/* Upload Form */}
                <div className="card animate-slide-up stagger-1">
                    <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Upload Content</h2>
                    <form onSubmit={handleUpload}>
                        <div className="input-group">
                            <label className="input-label">Video Title</label>
                            <input
                                className="input-field"
                                placeholder="Epic vlog episode 42..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">YouTube URL</label>
                            <input
                                className="input-field"
                                placeholder="https://youtube.com/watch?v=..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Description (Optional)</label>
                            <textarea
                                className="input-field"
                                placeholder="SEO description..."
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <button className="btn" type="submit" style={{ width: "100%" }}>
                            <Plus size={18} /> Add Video
                        </button>
                    </form>
                </div>

                {/* Video List */}
                <div>
                    <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Recent Videos</h2>
                    {loading ? (
                        <p style={{ color: "var(--text-muted)" }}>Loading videos...</p>
                    ) : videos.length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                            <Video size={48} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto 16px" }} />
                            <p>No videos found. Upload your first video!</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {videos.map((vid, index) => (
                                <div key={vid._id} className={`card animate-fade-in`} style={{ animationDelay: `${index * 0.1}s`, display: "flex", gap: "20px", padding: "16px", alignItems: "center" }}>
                                    <div style={{
                                        width: "120px", height: "68px",
                                        background: "rgba(0,0,0,0.4)", borderRadius: "8px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        cursor: "pointer"
                                    }}>
                                        <Play size={24} color="var(--primary)" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: "16px", marginBottom: "4px" }}>{vid.title}</h4>
                                        <p style={{ margin: 0, fontSize: "13px", color: "var(--primary)" }}>{vid.url}</p>
                                        <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.6 }}>
                                            Added {new Date(vid.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoManager;
