import { useState, useCallback } from 'react';

interface Province {
  id: string;
  nombre: string;
}

interface Municipality {
  id: string;
  nombre: string;
  provincia: {
    id: string;
    nombre: string;
  };
}

interface Locality {
  id: string;
  nombre: string;
  municipio: {
    id: string;
    nombre: string;
  };
  provincia: {
    id: string;
    nombre: string;
  };
}

interface StreetSuggestion {
  display_name: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  formatted: string;
}

export const useGeoRef = () => {
  const [loading, setLoading] = useState(false);

  const searchProvinces = useCallback(async (query: string): Promise<Province[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      setLoading(true);
      const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/provincias?nombre=${encodeURIComponent(query)}&max=10`
      );
      const data = await response.json();
      return data.provincias || [];
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMunicipalities = useCallback(async (query: string, provinceId?: string): Promise<Municipality[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      setLoading(true);
      let url = `https://apis.datos.gob.ar/georef/api/municipios?nombre=${encodeURIComponent(query)}&max=10`;
      if (provinceId) {
        url += `&provincia=${provinceId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      return data.municipios || [];
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLocalities = useCallback(async (query: string, provinceId?: string): Promise<Locality[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      setLoading(true);
      let url = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(query)}&max=10`;
      if (provinceId) {
        url += `&provincia=${provinceId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      return data.localidades || [];
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca calles, barrios y lugares específicos usando OpenStreetMap Nominatim
   * @param query - El texto de búsqueda (ej: "Av. Sarmiento", "Barrio Norte")
   * @param locality - Nombre de la localidad seleccionada
   * @param province - Nombre de la provincia seleccionada
   * @returns Array de sugerencias de calles/lugares
   */
  const searchStreets = useCallback(async (
    query: string,
    locality: string,
    province: string
  ): Promise<StreetSuggestion[]> => {
    if (!query || query.length < 3) return [];
    
    try {
      setLoading(true);
      
      // Construir la query completa para mejor precisión
      const searchQuery = `${query}, ${locality}, ${province}, Argentina`;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=10` +
        `&countrycodes=ar` +
        `&accept-language=es`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0' // Reemplaza con el nombre de tu app
          }
        }
      );
      
      const data = await response.json();
      
      // Formatear los resultados
      return data.map((item: any) => {
        const address = item.address || {};
        let formatted = '';
        
        // Construir el texto formateado basado en lo que está disponible
        if (address.road) {
          formatted = address.road;
          if (address.house_number) {
            formatted += ` ${address.house_number}`;
          }
        } else if (address.suburb) {
          formatted = address.suburb;
        } else if (address.neighbourhood) {
          formatted = address.neighbourhood;
        } else {
          formatted = query; // Fallback al query original
        }
        
        return {
          display_name: item.display_name,
          road: address.road,
          suburb: address.suburb,
          neighbourhood: address.neighbourhood,
          formatted: formatted,
        };
      }).filter((item: StreetSuggestion) => item.formatted); // Filtrar vacíos
      
    } catch (error) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    searchProvinces,
    searchMunicipalities,
    searchLocalities,
    searchStreets,
  };
};