
import { GeometryObject, GeometryCollection, GeoJsonProperties, Point, MultiPoint, LineString,MultiLineString,Polygon,MultiPolygon } from 'geojson';
import { Topology, Objects, Transform } from 'topojson-specification';


export interface MyTopoJSON extends Topology<Objects<any>> {
    bbox?: [number, number, number, number];
    transform?: Transform;
    objects: {
      counties: any;
      states: any;
      nation: any;
    };
}

export interface TopoJSONFeatureCollection extends GeometryCollection {
  // You can include additional properties here if needed
}

/*export type TopoJSONGeometryObject = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection<GeoJsonProperties>;*/
export type TopoJSONGeometryObject = GeometryObject & { properties?: GeoJsonProperties };

type TopoJSONGeometry = {
  type: 'Polygon' | 'MultiPolygon';
  arcs: number[][] | number[][][];
  id?: string;
  properties?: { name: string };
}
