import { useEffect } from 'react';
import {  useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function CustomToolbar() {
  const map = useMap();

  useEffect(() => {
    // Create a custom control
    const CustomControl = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create('div', 'custom-toolbar');
        container.innerHTML = `
          <button class="custom-button" title="My Action">
            <i class="fa fa-star"></i>
          </button>
        `;
        
        // Add your custom logic here
        container.querySelector('.custom-button').addEventListener('click', function() {
          alert('Button clicked!');
        });

        return container;
      }
    });

    // Add the custom control to the map
    const customControl = new CustomControl({ position: 'topleft' });
    customControl.addTo(map);

    return () => {
      // Remove the custom control when the component unmounts
      customControl.remove();
    };
  }, [map]);

  return null;
}

export default CustomToolbar; 