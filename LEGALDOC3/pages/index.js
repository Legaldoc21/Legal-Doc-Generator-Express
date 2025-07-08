export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 p-8">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">Redactor Legal Exprés</h1>
      <p className="text-lg text-center max-w-2xl mb-6">
        Describe tu situación legal y genera un documento personalizado.
      </p>
      <p className="text-red-500 font-semibold">Acceso restringido. Debes realizar el pago para acceder.</p>
    </div>
  );
}
