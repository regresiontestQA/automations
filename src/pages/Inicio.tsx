import { Link } from "react-router-dom";

const Inicio = () => {
  return (
    <>
      <main className="flex-grow container mx-auto mt-8 p-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 flex items-center">
              <img className="h-48  object-cover" src="/img.svg" alt="Robot SCP" />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-purple-600 font-semibold">Bienvenido a</div>
              <h2 className="block mt-1 text-3xl leading-tight font-bold text-gray-900">Informe Robot SCP</h2>
              <p className="mt-2 text-gray-600">
                Tu portal centralizado para gestionar y analizar informes de robots SCP. Accede a datos en tiempo real, genera informes detallados y optimiza tus operaciones con nuestra plataforma intuitiva.
              </p>
              <div className="mt-6 flex space-x-4">
                <Link to={"/inventario"} className="inline-block px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  Ver Inventario
                </Link>
                <Link to={"/ejecucion"} className="inline-block px-4 py-2 border border-purple-300 text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50">
                  Iniciar Ejecución
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to={"/informe-tecnico"} className="font-medium text-purple-600 hover:text-purple-500">
                Informe completo <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default Inicio;