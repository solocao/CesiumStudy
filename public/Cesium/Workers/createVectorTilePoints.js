define(["./when-cbf8cd21","./Check-35e1a91d","./Math-e66fad2a","./Cartesian2-44433f55","./AttributeCompression-170b3be0","./createTaskProcessorWorker"],function(a,e,v,y,A,r){"use strict";var M=32767,R=new y.Cartographic,x=new y.Cartesian3,D=new y.Rectangle,E=new y.Ellipsoid,F={min:void 0,max:void 0};return r(function(a,e){var r=new Uint16Array(a.positions);!function(a){a=new Float64Array(a);var e=0;F.min=a[e++],F.max=a[e++],y.Rectangle.unpack(a,2,D),e+=y.Rectangle.packedLength,y.Ellipsoid.unpack(a,e,E)}(a.packedBuffer);var t=D,n=E,i=F.min,s=F.max,o=r.length/3,c=r.subarray(0,o),u=r.subarray(o,2*o),p=r.subarray(2*o,3*o);A.AttributeCompression.zigZagDeltaDecode(c,u,p);for(var f=new Float64Array(r.length),h=0;h<o;++h){var l=c[h],d=u[h],m=p[h],C=v.CesiumMath.lerp(t.west,t.east,l/M),g=v.CesiumMath.lerp(t.south,t.north,d/M),b=v.CesiumMath.lerp(i,s,m/M),w=y.Cartographic.fromRadians(C,g,b,R),k=n.cartographicToCartesian(w,x);y.Cartesian3.pack(k,f,3*h)}return e.push(f.buffer),{positions:f.buffer}})});
