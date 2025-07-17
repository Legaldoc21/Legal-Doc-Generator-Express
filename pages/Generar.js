import { useState } from 'react';

export default function Generar() {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);

  const generar = async () => {
    setCargando(true);
    setResultado('');
    try {
      const res = await fetch('/api/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResultado(data.resultado || data.error || 'Sin respuesta');
    } catch (err) {
      setResultado('Error al conectar con el servidor.');
    }
    setCargando(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Generar Documento Legal</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe tu situación..."
        rows={6}
        style={{ width: '100%', padding: '10px' }}
      />
      <br />
      <button onClick={generar} disabled={cargando} style={{ marginTop: '10px' }}>
        {cargando ? 'Generando...' : 'Generar documento'}
      </button>
      <pre style={{ textAlign: 'left', marginTop: '20px', background: '#f9f9f9', padding: '10px' }}>
        {resultado}
      </pre>
    </div>
  );
}
