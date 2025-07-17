import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Redactor Legal Exprés</h1>
      <p>Describe tu situación legal y genera un documento personalizado.</p>
      <Link href="/Generar">
        <button style={{ marginTop: '20px', padding: '10px 20px', background: 'blue', color: 'white' }}>
          Comenzar
        </button>
      </Link>
    </div>
  );
}
