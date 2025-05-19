function buscarDestinos() {
  const palabraClave = document.getElementById('campo-busqueda').value.toLowerCase().trim();
  const contenedorResultados = document.getElementById('resultados-recomendacion');
  contenedorResultados.innerHTML = '';

  console.log("PalabraClave:"+palabraClave);
  if (!palabraClave) {
    contenedorResultados.innerHTML = '<p>Por favor, introduce una palabra clave.</p>';
    return;
  }

  fetch('travel_recommendation_api.json')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
      return response.json();
    })
    .then(data => {
      let resultados = [];

      // Palabras clave relacionadas a playas
      const clavesPlaya = ['playa', 'playas', 'beach', 'beaches'];
      const clavesTemplo = ['templo', 'templos', 'temple', 'temples'];
      const clavesPais = ['pais', 'paises', 'country', 'countries'];

      if (clavesPlaya.includes(palabraClave)) {
        resultados = data.beaches.map(entrada => ({
          titulo: entrada.name,
          imagen: entrada.imageUrl,
          descripcion: entrada.description
        }));
      } else if (clavesTemplo.includes(palabraClave)) {
        resultados = data.temples.map(entrada => ({
          titulo: entrada.name,
          imagen: entrada.imageUrl,
          descripcion: entrada.description
        }));
      } else if (clavesPais.includes(palabraClave)) {
        data.countries.forEach(pais => {
          pais.cities.forEach(ciudad => {
            resultados.push({
              titulo: `${ciudad.name} - ${pais.name}`,
              imagen: ciudad.imageUrl,
              descripcion: ciudad.description
            });
          });
        });
      }

      if (resultados.length === 0) {
        contenedorResultados.innerHTML = '<p>No se encontraron resultados para esa palabra clave.</p>';
        return;
      }

      const html = resultados.slice(0, 2).map(r => `
        <div class="recomendacion">
          <h3>${r.titulo}</h3>
          <img src="${r.imagen}" alt="${r.titulo}">
          <p>${r.descripcion}</p>
        </div>
      `).join('');

      contenedorResultados.innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
      contenedorResultados.innerHTML = '<p>Ocurrió un error al cargar los datos.</p>';
    });
}
function limpiarBusqueda() {
  // Limpia el campo de búsqueda
  document.getElementById('campo-busqueda').value = '';

  // Limpia los resultados mostrados
  const contenedorResultados = document.getElementById('resultados-recomendacion');
  contenedorResultados.innerHTML = '';
}
