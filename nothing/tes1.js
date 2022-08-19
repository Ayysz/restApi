const data = "1 bulan";
const bunga = "Rp. 2.000.000";

// 
const sbunga = bunga.split(' ')[1].replaceAll('.','');
const split = data.split(' ')[0];
// 

console.log(sbunga);
console.log(split);