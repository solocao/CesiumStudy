define(["exports","./when-cbf8cd21","./Check-35e1a91d","./Math-e66fad2a","./Cartesian2-44433f55","./Transforms-23521d7e","./IntersectionTests-4068523d","./Plane-47e9c397","./EllipsoidRhumbLine-862a2df4","./EllipsoidGeodesic-7779e55a"],function(a,w,e,P,T,v,m,y,A,r){"use strict";var E={numberOfPoints:function(a,e,r){var t=T.Cartesian3.distance(a,e);return Math.ceil(t/r)},numberOfPointsRhumbLine:function(a,e,r){var t=Math.pow(a.longitude-e.longitude,2)+Math.pow(a.latitude-e.latitude,2);return Math.max(1,Math.ceil(Math.sqrt(t/(r*r))))}},o=new T.Cartographic;E.extractHeights=function(a,e){for(var r=a.length,t=new Array(r),n=0;n<r;n++){var i=a[n];t[n]=e.cartesianToCartographic(i,o).height}return t};var R=new v.Matrix4,b=new T.Cartesian3,M=new T.Cartesian3,S=new y.Plane(T.Cartesian3.UNIT_X,0),D=new T.Cartesian3,x=new y.Plane(T.Cartesian3.UNIT_X,0),N=new T.Cartesian3,G=new T.Cartesian3,I=[];function k(a,e,r){var t=I;if(t.length=a,e===r){for(i=0;i<a;i++)t[i]=e;return t}for(var n=(r-e)/a,i=0;i<a;i++){var o=e+i*n;t[i]=o}return t}var V=new T.Cartographic,L=new T.Cartographic,_=new T.Cartesian3,O=new T.Cartesian3,B=new T.Cartesian3,U=new r.EllipsoidGeodesic,z=new A.EllipsoidRhumbLine;E.wrapLongitude=function(a,e){var r=[],t=[];if(w.defined(a)&&0<a.length){e=w.defaultValue(e,v.Matrix4.IDENTITY);var n=v.Matrix4.inverseTransformation(e,R),i=v.Matrix4.multiplyByPoint(n,T.Cartesian3.ZERO,b),o=T.Cartesian3.normalize(v.Matrix4.multiplyByPointAsVector(n,T.Cartesian3.UNIT_Y,M),M),s=y.Plane.fromPointNormal(i,o,S),c=T.Cartesian3.normalize(v.Matrix4.multiplyByPointAsVector(n,T.Cartesian3.UNIT_X,D),D),l=y.Plane.fromPointNormal(i,c,x),u=1;r.push(T.Cartesian3.clone(a[0]));for(var h=r[0],f=a.length,g=1;g<f;++g){var C,d,p=a[g];(y.Plane.getPointDistance(l,h)<0||y.Plane.getPointDistance(l,p)<0)&&(C=m.IntersectionTests.lineSegmentPlane(h,p,s,N),w.defined(C)&&(d=T.Cartesian3.multiplyByScalar(o,5e-9,G),y.Plane.getPointDistance(s,h)<0&&T.Cartesian3.negate(d,d),r.push(T.Cartesian3.add(C,d,new T.Cartesian3)),t.push(u+1),T.Cartesian3.negate(d,d),r.push(T.Cartesian3.add(C,d,new T.Cartesian3)),u=1)),r.push(T.Cartesian3.clone(a[g])),u++,h=p}t.push(u)}return{positions:r,lengths:t}},E.generateArc=function(a){w.defined(a)||(a={});var e=a.positions,r=e.length,t=w.defaultValue(a.ellipsoid,T.Ellipsoid.WGS84),n=w.defaultValue(a.height,0),i=Array.isArray(n);if(r<1)return[];if(1===r){var o,s=t.scaleToGeodeticSurface(e[0],O);return 0!==(n=i?n[0]:n)&&(o=t.geodeticSurfaceNormal(s,_),T.Cartesian3.multiplyByScalar(o,n,o),T.Cartesian3.add(s,o,s)),[s.x,s.y,s.z]}var c,l=a.minDistance;w.defined(l)||(c=w.defaultValue(a.granularity,P.CesiumMath.RADIANS_PER_DEGREE),l=P.CesiumMath.chordLength(c,t.maximumRadius));for(var u=0,h=0;h<r-1;h++)u+=E.numberOfPoints(e[h],e[h+1],l);var f=3*(u+1),g=new Array(f),C=0;for(h=0;h<r-1;h++)C=function(a,e,r,t,n,i,o,s){var c=t.scaleToGeodeticSurface(a,O),l=t.scaleToGeodeticSurface(e,B),u=E.numberOfPoints(a,e,r),h=t.cartesianToCartographic(c,V),f=t.cartesianToCartographic(l,L),g=k(u,n,i);U.setEndPoints(h,f);var C=U.surfaceDistance/u,d=s;h.height=n;var p=t.cartographicToCartesian(h,_);T.Cartesian3.pack(p,o,d),d+=3;for(var v=1;v<u;v++){var m=U.interpolateUsingSurfaceDistance(v*C,L);m.height=g[v],p=t.cartographicToCartesian(m,_),T.Cartesian3.pack(p,o,d),d+=3}return d}(e[h],e[h+1],l,t,i?n[h]:n,i?n[h+1]:n,g,C);I.length=0;var d=e[r-1],p=t.cartesianToCartographic(d,V);p.height=i?n[r-1]:n;var v=t.cartographicToCartesian(p,_);return T.Cartesian3.pack(v,g,f-3),g};var X=new T.Cartographic,q=new T.Cartographic;E.generateRhumbArc=function(a){w.defined(a)||(a={});var e=a.positions,r=e.length,t=w.defaultValue(a.ellipsoid,T.Ellipsoid.WGS84),n=w.defaultValue(a.height,0),i=Array.isArray(n);if(r<1)return[];if(1===r){var o,s=t.scaleToGeodeticSurface(e[0],O);return 0!==(n=i?n[0]:n)&&(o=t.geodeticSurfaceNormal(s,_),T.Cartesian3.multiplyByScalar(o,n,o),T.Cartesian3.add(s,o,s)),[s.x,s.y,s.z]}for(var c,l=w.defaultValue(a.granularity,P.CesiumMath.RADIANS_PER_DEGREE),u=0,h=t.cartesianToCartographic(e[0],X),f=0;f<r-1;f++)c=t.cartesianToCartographic(e[f+1],q),u+=E.numberOfPointsRhumbLine(h,c,l),h=T.Cartographic.clone(c,X);var g=3*(u+1),C=new Array(g),d=0;for(f=0;f<r-1;f++)d=function(a,e,r,t,n,i,o,s){var c=t.cartesianToCartographic(a,V),l=t.cartesianToCartographic(e,L),u=E.numberOfPointsRhumbLine(c,l,r);c.height=0,l.height=0;var h=k(u,n,i);z.ellipsoid.equals(t)||(z=new A.EllipsoidRhumbLine(void 0,void 0,t)),z.setEndPoints(c,l);var f=z.surfaceDistance/u,g=s;c.height=n;var C=t.cartographicToCartesian(c,_);T.Cartesian3.pack(C,o,g),g+=3;for(var d=1;d<u;d++){var p=z.interpolateUsingSurfaceDistance(d*f,L);p.height=h[d],C=t.cartographicToCartesian(p,_),T.Cartesian3.pack(C,o,g),g+=3}return g}(e[f],e[f+1],l,t,i?n[f]:n,i?n[f+1]:n,C,d);I.length=0;var p=e[r-1],v=t.cartesianToCartographic(p,V);v.height=i?n[r-1]:n;var m=t.cartographicToCartesian(v,_);return T.Cartesian3.pack(m,C,g-3),C},E.generateCartesianArc=function(a){for(var e=E.generateArc(a),r=e.length/3,t=new Array(r),n=0;n<r;n++)t[n]=T.Cartesian3.unpack(e,3*n);return t},E.generateCartesianRhumbArc=function(a){for(var e=E.generateRhumbArc(a),r=e.length/3,t=new Array(r),n=0;n<r;n++)t[n]=T.Cartesian3.unpack(e,3*n);return t},a.PolylinePipeline=E});
