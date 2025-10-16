import React, { useState } from 'react'

export default function App() {
    const [files, setFiles] = useState([])

    const handleOpenFiles = async () => {
        const paths = await window.electronAPI.openFiles()
        setFiles(prev => [...prev, ...paths])
    }

    const handleOpenFolder = async () => {
        const paths = await window.electronAPI.openFolder()
        setFiles(prev => [...prev, ...paths])
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>FlowBeat (prototipo)</h1>
            <button onClick={handleOpenFiles}>Importar canción(es)</button>
            <button onClick={handleOpenFolder} style={{ marginLeft: 8 }}>Importar carpeta</button>

            <h3>Archivos importados:</h3>
            <ul>
                {files.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
        </div>
    )
}
