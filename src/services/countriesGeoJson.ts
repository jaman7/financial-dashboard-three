import { catchError, from, Observable, switchMap, throwError } from 'rxjs';

export const fetchCountriesGeoJson$ = (): Observable<any> => {
  return from(fetch('/geojson/countries.geojson')).pipe(
    switchMap((response) => {
      if (!response.ok) {
        return throwError(() => new Error(`HTTP error! Status: ${response.status}`));
      }
      return from(response.json());
    }),
    catchError((error) => {
      console.error('Error fetching countries GeoJSON:', error);
      return throwError(() => error);
    })
  );
};
