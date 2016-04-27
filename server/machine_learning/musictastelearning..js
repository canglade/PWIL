/*
CF : https://www.npmjs.com/package/machine_learning AND http://joonku.com/project/machine_learning/apidoc
*/
var ml = require('machine_learning');

var data = [[1,0,1,0,1,1,1,0,0,0,0,0,1,0],
  [1,1,1,1,1,1,1,0,0,0,0,0,1,0],
  [1,1,1,0,1,1,1,0,1,0,0,0,1,0],
  [1,0,1,1,1,1,1,1,0,0,0,0,1,0],
  [1,1,1,1,1,1,1,0,0,0,0,0,1,1],
  [0,0,1,0,0,1,0,0,1,0,1,1,1,0],
  [0,0,0,0,0,0,1,1,1,0,1,1,1,0],
  [0,0,0,0,0,1,1,1,0,1,0,1,1,0],
  [0,0,1,0,1,0,1,1,1,1,0,1,1,1],
  [0,0,0,0,0,0,1,1,1,1,1,1,1,1],
  [0,0,1,0,1,1,1,1,0,0,1,1,1,0],
  [1,0,1,0,0,1,1,1,1,1,0,0,1,0]];

var dataTags = [[0],
  [0,2],
  [1,0],
  [1],
  [1],
  [2,1],
  [1,0],
  [0],
  [1],
  [0],
  [1],
  [2],
  [2],
  [2],
  [1,0],
  [1],
  [0],
  [0,2],
  [0]
];

var result = ml.kmeans.cluster({
  data : dataTags,
  k : 6, // Nombre de Clusters
  epochs: 500, // Limite du nombre de boucle
  init_using_data : true, // Les données  initiales des clusters sont prisent aléatoirement si True
  distance : {type : "euclidean"}

  /*
   distance : {type : 'euclidean'} // this is default
   distance : {type : 'pearson'}

   Or you can use your own distance

   distance : function(x1,x2) { // Euclidean Distance Function
   var distance = 0;
   for(var i=0 ; i < x1.length; i++) {
   var dx = x1[i] - x2[i];
   distance += dx * dx;
   }
   return Math.sqrt(distance);
   };
   */
});

console.log("clusters : ", result.clusters);
// clusters :  [ [ 5, 6, 7, 8, 9, 10 ], [], [], [ 0, 1, 2, 3, 4 ] ]
// Les numéros correspondent à l'index dans le tableau de données data

//console.log("means : ", result.means);
/* means :  [ [ 0.16666666666666666, 0, 0.5, 0, 0.16666666666666666, 0.5, 0.8333333333333334, 0.8333333333333334, 0.8333333333333334, 0.6666666666666666, 0.5, 0.8333333333333334, 1, 0.3333333333333333 ],
 [ 1, 0.25, 1, 0.25, 0.75, 1, 1, 0.5, 0.5, 0.25, 0, 0, 1, 0 ],
 [ 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0 ],
 [ 1, 0.6, 1, 0.6, 1, 1, 1, 0.2, 0.2, 0, 0, 0, 1, 0.2 ] ]*/

module.exports = result;
