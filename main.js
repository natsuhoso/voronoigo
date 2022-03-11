


let $body = $('body');
let $main = $('#main');

function onResize(func){
	let resizetimer = null;
	$(window).resize( ()=> { clearTimeout(resizetimer); resizetimer=setTimeout( ()=>{
		func();
	},20)})
}

function setmain(){
	let w = $body.width();
	let h = $body.height();
	let width = w<h ? w : h ;
	width = width - (width % 100)
	$main.width(width)
	$main.height(width)
	$main.css({
		'top': `${(h-width)/2}px`,
		'left': `${(w-width)/2}px`
	})
}

setmain()
onResize(setmain)

for(let i=0; i<10000; i++){
	let x = i % 100;
	let y = (i / 100) | 0;
	let $tile = $('<div>');
	$tile.addClass('tile')
	$tile.addClass('state0')
	$tile.attr('id', `no${i}`)
	$tile.css({
		'left': `${x}%`,
		'top': `${y}%`,
		'width': '1%',
		'height': '1%',
	})
	$main.append($tile)
}


// $('#no1010').addClass('state1')
// $('#no1010').addClass('stone')
// $('#no2020').addClass('state-1')
// $('#no2020').addClass('stone')

let blackStones = []
let whiteStones = []

function distance(i,j){
	let x1 = i % 100;
	let y1 = (i-x1) / 100;
	let x2 = j % 100;
	let y2 = (j-x2) / 100;
	// return Math.abs(x1-x2) + Math.abs(y1-y2) // マンハッタン距離
	return Math.sqrt( (x1-x2)**2 + (y1-y2)**2 )  // ユークリッド距離
	// return Math.max( Math.abs(x1-x2), Math.abs(y1-y2) )  //チェビシェフ距離

	// let xhex = (x1-x2) + (y1-y2)/Math.sqrt(3)
	// let yhex = 2*(y1-y2)/Math.sqrt(3)
	// return xhex*yhex>0 ? Math.max(Math.abs(xhex),Math.abs(yhex)) : Math.abs(xhex)+Math.abs(yhex)
}

function voronoi(){
	for(let i=0; i<10000; i++){
		let $tile = $(`#no${i}`)
		let len_black=1000;
		blackStones.forEach(el=>{
			let d = distance(i, el)
			len_black = d < len_black ? d : len_black;
		})
		let len_white=1000;
		whiteStones.forEach(el=>{
			let d = distance(i, el)
			len_white = d < len_white ? d : len_white;
		})
		if(len_black < len_white){
			$tile.removeClass('state0')
			$tile.removeClass('state1')
			$tile.addClass('state-1')
		}else if(len_black > len_white){
			$tile.removeClass('state0')
			$tile.removeClass('state-1')
			$tile.addClass('state1')
		}else{
			$tile.removeClass('state1')
			$tile.removeClass('state-1')
			$tile.addClass('state0')
		}
	}

}


let blackTurn = true;

for(let i=0; i<10000; i++){
	let $tile = $(`#no${i}`)
	$tile.click(function(){
		if(blackStones.includes(i)) return 0;
		if(whiteStones.includes(i)) return 0;
		$tile.addClass('stone');
		blackTurn ? blackStones.push(i) : whiteStones.push(i);
		blackTurn = !blackTurn;
		voronoi()
	})
}