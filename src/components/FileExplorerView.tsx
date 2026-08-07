import React from 'react';
import { 
  FolderTree, 
  FileCode, 
  Folder, 
  FileText, 
  File, 
  Plus, 
  FolderPlus, 
  Upload, 
  Trash2, 
  Edit, 
  Download, 
  Save, 
  X, 
  ChevronRight, 
  Search, 
  Sliders, 
  CheckCircle2, 
  Code,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerViewProps {
  files: FileItem[];
  onSaveFileContent: (path: string, newContent: string) => void;
  onCreateNewFile: (parentPath: string, fileName: string) => void;
  onDeleteFile: (path: string) => void;
  darkMode: boolean;
}

export const FileExplorerView: React.FC<FileExplorerViewProps> = ({
  files,
  onSaveFileContent,
  onCreateNewFile,
  onDeleteFile,
  darkMode,
}) => {
  const [currentPath, setCurrentPath] = React.useState('/opt/minecraft/server');
  const [editingFile, setEditingFile] = React.useState<FileItem | null>(null);
  const [editorContent, setEditorContent] = React.useState('');
  const [activeViewMode, setActiveViewMode] = React.useState<'files' | 'server_properties_builder'>('files');
  const [searchTerm, setSearchTerm] = React.useState('');

  // New File / Folder Modal
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState('');

  // Find items at current path
  const currentFolder = React.useMemo(() => {
    if (currentPath === '/opt/minecraft/server') {
      return { path: '/opt/minecraft/server', children: files };
    }
    // Search recursively
    const findFolder = (items: FileItem[], targetPath: string): FileItem | null => {
      for (const item of items) {
        if (item.path === targetPath) return item;
        if (item.children) {
          const found = findFolder(item.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };
    return findFolder(files, currentPath) || { path: currentPath, children: [] };
  }, [files, currentPath]);

  const currentChildren = (currentFolder.children || []).filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  const handleOpenFile = (file: FileItem) => {
    if (file.isDirectory) {
      setCurrentPath(file.path);
    } else {
      setEditingFile(file);
      setEditorContent(file.content || `# Content of ${file.name}\n`);
    }
  };

  const handleSaveEdit = () => {
    if (!editingFile) return;
    onSaveFileContent(editingFile.path, editorContent);
    setEditingFile(null);
  };

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onCreateNewFile(currentPath, newFileName);
    setNewFileName('');
    setShowCreateModal(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto custom-scrollbar">
      {/* Top Header & Breadcrumb Bar */}
      <div className={`p-4 rounded-xl border space-y-3 ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center space-x-2">
                <span>Graphical Arch Linux Filesystem</span>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  SFTP / Root
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Browse server directory `/opt/minecraft/server`, edit config files & YML settings
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveViewMode(activeViewMode === 'files' ? 'server_properties_builder' : 'files')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                activeViewMode === 'server_properties_builder' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>server.properties Builder</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New File</span>
            </button>
          </div>
        </div>

        {/* Breadcrumb Path & Search */}
        {activeViewMode === 'files' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
            <div className="flex items-center space-x-1 overflow-x-auto py-1 custom-scrollbar">
              <button
                onClick={() => setCurrentPath('/opt/minecraft/server')}
                className="text-cyan-400 hover:underline flex items-center space-x-1 font-semibold shrink-0"
              >
                <span>/</span>
              </button>
              {breadcrumbs.map((crumb, idx) => {
                const crumbPath = '/' + breadcrumbs.slice(0, idx + 1).join('/');
                return (
                  <React.Fragment key={crumbPath}>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <button
                      onClick={() => setCurrentPath(crumbPath)}
                      className={`shrink-0 hover:underline ${
                        idx === breadcrumbs.length - 1 ? 'text-slate-200 font-bold' : 'text-cyan-400'
                      }`}
                    >
                      {crumb}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter files in directory..."
                className="pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 w-full sm:w-48 font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Visual server.properties Builder Mode */}
      {activeViewMode === 'server_properties_builder' ? (
        <div className={`p-5 rounded-xl border space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-semibold text-sm text-slate-100 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Visual `server.properties` Visual Form Editor</span>
              </h3>
              <p className="text-xs text-slate-400">
                Modify core server properties without manually parsing text files.
              </p>
            </div>
            <button
              onClick={() => {
                onSaveFileContent('/opt/minecraft/server/server.properties', editorContent || '# Updated');
                setActiveViewMode('files');
              }}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save server.properties</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-slate-400 block font-semibold">Max Players (max-players):</label>
              <input
                type="number"
                defaultValue={50}
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-slate-400 block font-semibold">Game Difficulty (difficulty):</label>
              <select className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100">
                <option value="peaceful">peaceful</option>
                <option value="easy">easy</option>
                <option value="normal">normal</option>
                <option value="hard" selected>hard</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-slate-400 block font-semibold">Default Gamemode (gamemode):</label>
              <select className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100">
                <option value="survival" selected>survival</option>
                <option value="creative">creative</option>
                <option value="adventure">adventure</option>
                <option value="spectator">spectator</option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 col-span-full">
              <label className="text-slate-400 block font-semibold">Server MOTD (motd):</label>
              <input
                type="text"
                defaultValue="\u00A7b\u00A7lArchCraft Minecraft \u00A77| \u00A7eArch Linux 6.10 \u00A7a[1.20.4]"
                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Main Files Table View */
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3">Name</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Permissions</th>
                  <th className="p-3">Last Modified</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Parent Directory Go Up Button */}
                {currentPath !== '/opt/minecraft/server' && (
                  <tr 
                    onClick={() => {
                      const parent = currentPath.substring(0, currentPath.lastIndexOf('/')) || '/opt/minecraft/server';
                      setCurrentPath(parent);
                    }}
                    className="hover:bg-slate-800/40 cursor-pointer text-cyan-400"
                  >
                    <td className="p-3 flex items-center space-x-2.5 font-bold">
                      <ArrowLeft className="w-4 h-4" />
                      <span>.. (Parent Directory)</span>
                    </td>
                    <td className="p-3 text-slate-500">-</td>
                    <td className="p-3 text-slate-500">drwxr-xr-x</td>
                    <td className="p-3 text-slate-500">-</td>
                    <td className="p-3"></td>
                  </tr>
                )}

                {currentChildren.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Folder is empty or no files match search.
                    </td>
                  </tr>
                ) : (
                  currentChildren.map(item => (
                    <tr 
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenFile(item)}
                          className="flex items-center space-x-2.5 text-left hover:text-cyan-400 transition-colors"
                        >
                          {item.isDirectory ? (
                            <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20 shrink-0" />
                          ) : item.name.endsWith('.properties') || item.name.endsWith('.yml') ? (
                            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className={`font-semibold ${item.isDirectory ? 'text-amber-300' : 'text-slate-200'}`}>
                            {item.name}
                          </span>
                        </button>
                      </td>
                      <td className="p-3 text-slate-400">{item.isDirectory ? '-' : formatSize(item.size)}</td>
                      <td className="p-3 text-slate-500">{item.permissions}</td>
                      <td className="p-3 text-slate-400">{item.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5 opacity-80 group-hover:opacity-100">
                          {!item.isDirectory && (
                            <button
                              onClick={() => handleOpenFile(item)}
                              title="Edit file content"
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteFile(item.path)}
                            title="Delete file"
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Code Editor Modal for files */}
      {editingFile && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs">
          <div className="w-full max-w-4xl h-[85vh] rounded-xl border border-slate-800 bg-slate-950 text-slate-200 shadow-2xl flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-100">{editingFile.path}</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400">
                  {editingFile.permissions}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => setEditingFile(null)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code Editor Textarea */}
            <div className="flex-1 p-3 bg-slate-950 font-mono text-xs text-emerald-300 relative">
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full h-full bg-transparent focus:outline-none resize-none leading-relaxed custom-scrollbar font-mono text-emerald-300"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* New File Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-md p-5 rounded-xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-base font-semibold mb-1 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>Create New File in Arch Filesystem</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Target folder: {currentPath}
            </p>

            <form onSubmit={handleCreateFileSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">File Name:</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. ops.json or paper-world.yml"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFileName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium disabled:opacity-50"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
