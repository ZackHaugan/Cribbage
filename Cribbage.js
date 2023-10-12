// card nums assigned by number*10+suit
// make all cards list:
let allCards = [];
for(i=0;i<13;i++){
  for(j=0;j<4;j++){
    allCards.push({n:[1,2,3,4,5,6,7,8,9,10,11,12,13][i], s:['S','H','C','D'][j], fn:[1,2,3,4,5,6,7,8,9,10,10,10,10][i]});
  }
}

// establish dealing
let dealing = true;
let solving = false;
let selectingCut = false;
let postsolving = false;

let yellow = "F2CA00";
let pink = "FF5A52";
let green = "08BF5D";
let cut = {n:undefined, s:undefined, fn:undefined};
let selectedListNums = [];
let handCards = [];
let cardTable = document.getElementById("cardSelector");

function graph(){

}

function toggleDealing(){
  if(solving || postsolving){
    return;
  }
  if(dealing){
    dealing = false;
    document.getElementById('dealingButton').innerText = "Opponent is Dealing";
  } else {
    dealing = true;
    document.getElementById('dealingButton').innerText = "You are Dealing";
  }
}

function clearHand(){
  if(solving || postsolving){
    return;
  }
  toggleDealing();
  document.getElementById("instructions").innerText = "Select your hand";
  selectingCut = false;
  cut = {n:-1, s:'U', fn:-1};
  handCards = [];
  selectedListNums = [];
  drawhand();
  for(let u=0;u<4;u++){
    for(let o=0;o<13;o++){
      document.getElementById(['A','2','3','4','5','6','7','8','9','T','J','Q','K'][o]+['S','H','C','D'][u]).classList.remove("testThrow");
      document.getElementById(['A','2','3','4','5','6','7','8','9','T','J','Q','K'][o]+['S','H','C','D'][u]).style.opacity = 0.5;
      document.getElementById(['A','2','3','4','5','6','7','8','9','T','J','Q','K'][o]+['S','H','C','D'][u]).classList.remove('cut');

    }
  }
  document.getElementById('stats').innerHTML = "";
}

function select(cardNum){
  if(solving||postsolving){
    return;
  }
  // decode number info
  let card = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'][Math.floor(cardNum/10)]+['S','H','C','D'][cardNum-Math.floor(cardNum/10)*10];

  if(selectingCut){
    // extract cut card info
    cut = {n:Math.floor(cardNum/10)+1, s:['S','H','C','D'][cardNum-Math.floor(cardNum/10)*10], fn:(Math.floor(cardNum/10)+1<10?Math.floor(cardNum/10)+1:10)};
    //reject if cut is in hand
    for(let w=0;w<6;w++){
      if(cut.n == handCards[w].n && cut.s == handCards[w].s){
        alert("Invalid Cut Card");
        cut = {n:-1, s:'U', fn:-1};
        return;
      }
    }

    // highlight cut card;
    document.getElementById(card).style.opacity = '1';
    document.getElementById(card).classList.add('cut');

    selectingCut = false;
    postsolving = true;

  } else {
    if(selectedListNums.includes(cardNum)){
      // Card is IN the list (deselect it)
      document.getElementById("instructions").innerText = "Select your hand";

      document.getElementById(card).style.opacity = '0.5';
      selectedListNums.splice(selectedListNums.indexOf(cardNum),1);

      // also deselect cut card
      for(let cu=0; cu<document.getElementsByClassName('cut').length;cu++){
        document.getElementsByClassName('cut')[0].style.opacity = '0.5';
        document.getElementsByClassName('cut')[0].classList.remove('cut');
      }
      cut = {n:-1, s:'U', fn:-1};

      //clear stats
      document.getElementById('stats').innerHTML = "";
      solving = false;
      indexNum = 0;
      scoreList = [];


      // sort nums array and rewrite hand card array
      selectedListNums.sort(function(a, b){return a - b});
      handCards = [];
      for(i=0;i<selectedListNums.length;i++){
        handCards.push({n:[1,2,3,4,5,6,7,8,9,10,11,12,13][Math.floor(selectedListNums[i]/10)], s:['S','H','C','D'][selectedListNums[i]-Math.floor(selectedListNums[i]/10)*10], fn:[1,2,3,4,5,6,7,8,9,10,10,10,10][Math.floor(selectedListNums[i]/10)]});
      }
      drawhand();
      if(selectedListNums.length==5){

        // remove invert
        for(let u=0;u<4;u++){
          for(let o=0;o<13;o++){
            // find card texts
            document.getElementById(['A','2','3','4','5','6','7','8','9','T','J','Q','K'][o]+['S','H','C','D'][u]).classList.remove("testThrow");
          }
        }
      }
    } else {
      // Card is NOT in the list
      if(selectedListNums.length<6){
        // select it
        document.getElementById(card).style.opacity = '1';
        selectedListNums.push(cardNum);
        // sort nums array and rewrite hand card array
        selectedListNums.sort(function(a, b){return a - b});
        handCards = [];
        for(i=0;i<selectedListNums.length;i++){
          handCards.push({n:[1,2,3,4,5,6,7,8,9,10,11,12,13][Math.floor(selectedListNums[i]/10)], s:['S','H','C','D'][selectedListNums[i]-Math.floor(selectedListNums[i]/10)*10], fn:[1,2,3,4,5,6,7,8,9,10,10,10,10][Math.floor(selectedListNums[i]/10)]});
        }
        drawhand();
        if(selectedListNums.length==6){
          // 6 cards in the hand
          document.getElementById('stats').style.paddingTop = "0px";
          document.getElementById('stats').innerHTML = "<div style='display: inline-block;padding-top:300px;'><div class='multi-spinner-container'><div class='multi-spinner'><div class='multi-spinner'><div class='multi-spinner'><div class='multi-spinner'><div class='multi-spinner'><div class='multi-spinner'></div></div></div></div></div></div><p id='percent'>0%</p></div></div>";
          solving = true;
        }
      }
    }
  }
}

function drawhand(){
  let handHTML = "<tr>";
  for(i=0;i<selectedListNums.length;i++){
    let ct = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'][Math.floor(selectedListNums[i]/10)]+['S','H','C','D'][selectedListNums[i]-Math.floor(selectedListNums[i]/10)*10];
    handHTML += "<td><img src=Cards/"+ct+".png class='card' draggable='false' id='hand"+ct+"'></td>";
  }
  handHTML+="</tr>";
  document.getElementById('handCards').innerHTML = handHTML;
}

function score(inhand, dealing, crib){
  // last card is the cut card
  // hand is list of objects {n:(number), s:(suit), fn:(fifteen number)
  let fifteenScore = 0;
  let pairScore = 0;
  let runScore = 0;
  let flushScore = 0;
  let specialScore = 0;
  let hand = [...inhand];

  let scoreRuns3 = true;

  // cut a jack as dealer
  if(dealing && hand[4].n == 11 && crib==false){
    specialScore += 2;
  }

  // knobs (have a jack w same suit as cut)
  for(i=0;i<4;i++){
    if(hand[i].n == 11 && hand[i].s == hand[4].s){
      specialScore += 1;
      break;
    }
  }

  // flushes
  if(crib){
    for(i=1;i<5;i++){
      if(hand[i].s !== hand[0].s){
        break;
      } else if(i==4){
        flushScore += 5;
      }
    }
  } else {
    for(i=1;i<5;i++){
      if(hand[i].s !== hand[0].s){
        break;
      } else if(i==3){
        flushScore += 4;
      } else if(i==4){
        flushScore += 1;
      }
    }
  }

  // 15 (5)
  if(hand[0].fn+hand[1].fn+hand[2].fn+hand[3].fn+hand[4].fn == 15){
    fifteenScore += 2;
  }

  // SORT HAND BY nums
  hand.sort((a, b) => a.n - b.n);

  // run (5)
  if(hand[0].n==hand[1].n-1 && hand[0].n==hand[2].n-2 && hand[0].n==hand[3].n-3 && hand[0].n==hand[4].n-4){
    runScore += 5;
    scoreRuns3 = false;
  } else {
    for(i=0;i<5;i++){
      let midHand = [...hand]
      midHand.splice(i,1);
      // run (4)
      if(midHand[0].n==midHand[1].n-1 && midHand[0].n==midHand[2].n-2 && midHand[0].n==midHand[3].n-3){
        runScore+=4;
        scoreRuns3=false;
      }
      // 15 (4)
      if(midHand[0].fn+midHand[1].fn+midHand[2].fn+midHand[3].fn == 15){
        fifteenScore += 2;
      }
    }
  }

  // Main Loop
  for(i=0;i<4;i++){
    for(j=i+1;j<5;j++){
      let midHand = [...hand]
      midHand.splice(j,1);
      midHand.splice(i,1);
      // pairs
      if(hand[i].n == hand[j].n){
        pairScore += 2;
      }

      // 15 (2)
      if(hand[i].fn+hand[j].fn == 15){
        fifteenScore += 2;
      }

      // 15 (3)
      if(midHand[0].fn+midHand[1].fn+midHand[2].fn == 15){
        fifteenScore += 2;
      }

      // run (3)
      if(scoreRuns3 && midHand[0].n==midHand[1].n-1 && midHand[0].n==midHand[2].n-2){
        runScore+=3;
      }
    }
  }
  return (fifteenScore+pairScore+runScore+flushScore+specialScore);
}

function detailedScore(inhand, dealing, crib, fancy){
  // last card is the cut card
  // hand is list of objects {n:(number), s:(suit), fn:(fifteen number)
  let fifteenScore = 0;
  let pairScore = 0;
  let runScore = [];
  let flushScore = 0;
  let jackScore = 0;
  let knobsScore = 0;
  let scoreText = "";
  let hand = [...inhand];

  let scoreRuns3 = true;

  // cut a jack as dealer
  if(dealing && hand[4].n == 11 && crib==false){
    jackScore += 2;
  }

  // knobs (have a jack w same suit as cut)
  for(i=0;i<4;i++){
    if(hand[i].n == 11 && hand[i].s == hand[4].s){
      knobsScore += 1;
      break;
    }
  }

  // flushes
  if(crib){
    for(i=1;i<5;i++){
      if(hand[i].s !== hand[0].s){
        break;
      } else if(i==4){
        flushScore += 5;
      }
    }
  } else {
    for(i=1;i<5;i++){
      if(hand[i].s !== hand[0].s){
        break;
      } else if(i==3){
        flushScore += 4;
      } else if(i==4){
        flushScore += 1;
      }
    }
  }

  // 15 (5)
  if(hand[0].fn+hand[1].fn+hand[2].fn+hand[3].fn+hand[4].fn == 15){
    fifteenScore += 2;
  }

  // SORT HAND BY nums
  hand.sort((a, b) => a.n - b.n);

  // run (5)
  if(hand[0].n==hand[1].n-1 && hand[0].n==hand[2].n-2 && hand[0].n==hand[3].n-3 && hand[0].n==hand[4].n-4){
    runScore.push(5);
    scoreRuns3 = false;
  } else {
    for(i=0;i<5;i++){
      let midHand = [...hand];
      midHand.splice(i,1);
      // run (4)
      if(midHand[0].n==midHand[1].n-1 && midHand[0].n==midHand[2].n-2 && midHand[0].n==midHand[3].n-3){
        runScore.push(4);
        scoreRuns3=false;
      }
      // 15 (4)
      if(midHand[0].fn+midHand[1].fn+midHand[2].fn+midHand[3].fn == 15){
        fifteenScore += 2;
      }
    }
  }

  // Main Loop
  for(i=0;i<4;i++){
    for(j=i+1;j<5;j++){
      let midHand = [...hand]
      midHand.splice(j,1);
      midHand.splice(i,1);
      // pairs
      if(hand[i].n == hand[j].n){
        pairScore += 2;
      }

      // 15 (2)
      if(hand[i].fn+hand[j].fn == 15){
        fifteenScore += 2;
      }

      // 15 (3)
      if(midHand[0].fn+midHand[1].fn+midHand[2].fn == 15){
        fifteenScore += 2;
      }

      // run (3)
      if(scoreRuns3 && midHand[0].n==midHand[1].n-1 && midHand[0].n==midHand[2].n-2){
        runScore.push(3);
      }
    }
  }

  if(fancy){
    // fifteen text
    if(fifteenScore>0){
      scoreText += "Fifteen";
      for(let ft=0;ft<fifteenScore;ft+=2){
        scoreText += " "+(ft+2);
      }
      scoreText += ", "
    }
    if(pairScore>0){
      scoreText += "Pair is";
      for(let ps=fifteenScore;ps<pairScore+fifteenScore;ps+=2){
        scoreText += " "+(ps+2);
      }
      scoreText += ", "
    }
    if(runScore.length>0){
      let runningRunScore = 0;
      for(rs=0;rs<runScore.length;rs++){
        scoreText += runScore[rs]+" is "+(runScore[rs]+runningRunScore+fifteenScore+pairScore)+", ";
        runningRunScore+=runScore[rs];
      }
    }
    if(flushScore>0){
      scoreText += "flush is "+(flushScore+fifteenScore+pairScore+runScore.reduce((a, b) => a + b, 0))+", ";
    }
    if(knobsScore>0){
      scoreText += "knobs is "+(knobsScore+flushScore+fifteenScore+pairScore+runScore.reduce((a, b) => a + b, 0))+", ";
    }
    if(jackScore>0){
      scoreText += "cut jack is "+(jackScore+knobsScore+flushScore+fifteenScore+pairScore+runScore.reduce((a, b) => a + b, 0))+", ";
    }

    //trim text
    if(scoreText.length > 0){
      scoreText = scoreText.slice(0,-2);
    }
  } else{
    scoreText = "15: "+fifteenScore+", pairs: "+pairScore+", runs: "+runScore.reduce((a, b) => a + b, 0)+", flush: "+flushScore+", knobs: "+knobsScore+", jack: "+jackScore;
  }
  return scoreText;
}

function cardRemove(all, card){
  for(let i=0;i<all.length;i++){
    if(all[i].n == card.n && all[i].s == card.s){
      all.splice(i,1);
      return all;
    }
  }
}

function solveWithThrows(tr1, tr2){
  // remove hand cards from allcards list
  let remainingCards = [...allCards];
  for(i=0;i<6;i++){
    remainingCards = cardRemove(remainingCards, handCards[i]);
  }

  // solve loops
      let tempScore = {throws:[tr1,tr2], allscores:[], handscores:[], cribscores:[]};
      //setup score objects

      //create temp hand of 4
      let tempHand = [...handCards];
      tempHand.splice(tr2,1);
      tempHand.splice(tr1,1);

      // simulate all cuts
      for(cut=0;cut<46;cut++){
        let remainingOppThrows = [...remainingCards];
        remainingOppThrows.splice(cut,1);
        // simulate all opponent throws
        for(otr1=0;otr1<44;otr1++){
          for(otr2=otr1+1;otr2<45;otr2++){
            tempScore.handscores.push(score([...tempHand].concat(remainingCards[cut]), dealing, false));
            tempScore.cribscores.push(((dealing?1:-1)*score([handCards[tr1], handCards[tr2], remainingOppThrows[otr1], remainingOppThrows[otr2], remainingCards[cut]], false, true)));
            tempScore.allscores.push(tempScore.handscores[tempScore.handscores.length-1]+tempScore.cribscores[tempScore.cribscores.length-1]);
          }
        }
      }
      tempScore.allscores = tempScore.allscores.reduce((sume, el) => sume + el, 0) / tempScore.allscores.length;
  return tempScore;
}

// Display all cards
let cardHTML = "";
for(i=0;i<4;i++){
  cardHTML+="<tr>";
  for(j=0;j<13;j++){
    // find card texts
    let c1t = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'][j]+['S','H','C','D'][i];
    let c1n = j*10+i;
      cardHTML+="<td><img src=Cards/"+c1t+".png class='card' id='"+c1t+"' onclick='select("+c1n+");' style='opacity:0.5;' draggable='false'></td>";
  }
  cardHTML+="</tr>";
  cardTable.innerHTML = cardHTML;
}

// MAIN Loop

const indexList = [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,4],[3,5],[4,5]];
let indexNum = 0;
let scoreList = [];

function main(){
  requestAnimationFrame(main);
  if(solving){
    document.getElementById("instructions").innerText = "Solving...";
    if(indexNum == 0){
      scoreList = [];
    }
    scoreList.push(solveWithThrows(indexList[indexNum][0], indexList[indexNum][1]));

    //update percent
    document.getElementById('percent').innerText = ((indexNum+1)*100/15).toFixed(2)+"%";

    //update card looks
    for(let k=0;k<4;k++){
      for(let l=0;l<13;l++){
        if((handCards[indexList[indexNum][0]].n==l+1 && handCards[indexList[indexNum][0]].s == ['S','H','C','D'][k]) || (handCards[indexList[indexNum][1]].n==l+1 && handCards[indexList[indexNum][1]].s == ['S','H','C','D'][k])){
          document.getElementById(['A','2','3','4','5','6','7','8','9','T','J','Q','K'][l]+['S','H','C','D'][k]).classList.add("testThrow");
        } else {
          document.getElementById(['A','2','3','4','5','6','7','8','9','T','J','Q','K'][l]+['S','H','C','D'][k]).classList.remove("testThrow");
        }
      }
    }


    if(indexNum == 14){
      solving = false;
      indexNum = -1;

      document.getElementById("instructions").innerText = "Select cut card";

      // SORT scoreList
      scoreList.sort((a,b)=> a.allscores - b.allscores);
      console.log(scoreList);
      document.getElementById('stats').style.paddingTop = "50px";

      // un-invert all cards
      for(let k=0;k<4;k++){
        for(let l=0;l<13;l++){
          document.getElementById(['A','2','3','4','5','6','7','8','9','T','J','Q','K'][l]+['S','H','C','D'][k]).classList.remove("testThrow");
        }
      }
      //invert hand cards
      for(let k=0;k<6;k++){
        if((handCards[scoreList[14].throws[0]].n == handCards[k].n && handCards[scoreList[14].throws[0]].s == handCards[k].s) || (handCards[scoreList[14].throws[1]].n == handCards[k].n && handCards[scoreList[14].throws[1]].s == handCards[k].s)){
          document.getElementById('hand'+['A','2','3','4','5','6','7','8','9','T','J','Q','K'][handCards[k].n-1]+handCards[k].s).classList.add('testThrow');
        }
      }

      // DISPLAY STATS

      // Your Hand
      let statsHTML = "<div><table style='vertical-align: middle;'><tr>";
      for(let y=0;y<6;y++){
        let ct =  ['A','2','3','4','5','6','7','8','9','T','J','Q','K'][handCards[y].n-1]+handCards[y].s;
        if(y!==scoreList[14].throws[0] && y!==scoreList[14].throws[1]){
          statsHTML+="<td><img src=Cards/"+ct+".png class='card' draggable='false'></td>";
        }
      }
      statsHTML+="<td id='handcut'><img src=Cards/UR.png class='card cut' draggable='false'></td></tr></table></div><div id='handstats' style='text-align:left;'><h2>Hand Stats:</h2><p>Worst Case Score:<span class='stat'> "+Math.min(...scoreList[14].handscores)+"</span> Points</p><p>Average Hand Score: <span class='stat'>"+([...scoreList[14].handscores].reduce((a,b)=>a+b,0)/scoreList[14].handscores.length).toFixed(3)+"</span> Points</p><p>Best Case Score: <span class='stat'>"+Math.max(...scoreList[14].handscores)+"</span> Points</p></div>";

      // Crib Hand
      statsHTML += "<hr style='height:2px;border-width:0;color:white;background-color:white;margin:20px 0 20px 0;'><div><table style='vertical-align: middle;'><tr>";
      for(let y=0;y<2;y++){
        let ct =  ['A','2','3','4','5','6','7','8','9','T','J','Q','K'][handCards[scoreList[14].throws[y]].n-1]+handCards[scoreList[14].throws[y]].s;
        statsHTML+="<td><img src=Cards/"+ct+".png class='card' style='' draggable='false'></td>";
      }
      statsHTML+="<td><img src=Cards/UB.png class='card' draggable='false'></td><td><img src=Cards/UB.png class='card' draggable='false'></td><td id='cribcut'><img src=Cards/UR.png class='card cut' draggable='false'></td></tr></table></div><div id='cribstats' style='text-align:left;'><h2>Crib Stats:</h2><p>Worst Case Score: <span class='stat'>"+Math.abs(Math.min(...scoreList[14].cribscores))+"</span> Points</p><p>Average Crib Score: <span class='stat'>"+Math.abs([...scoreList[14].cribscores].reduce((a,b)=>a+b,0)/scoreList[14].cribscores.length).toFixed(3)+"</span> Points</p><p>Best Case Score: <span class='stat'>"+Math.abs(Math.max(...scoreList[14].cribscores))+"</span> Points</p></div>"

      // display stats
      document.getElementById('stats').innerHTML = statsHTML;
      selectingCut = true;

    }
    indexNum++;
  } else if (postsolving) {
    postsolving = false;
    document.getElementById("instructions").innerText = "Clear hand when done";

    // display cut card in stats
    let ct = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'][cut.n-1]+cut.s;
    document.getElementById('handcut').innerHTML = "<img src=Cards/"+ct+".png class='card cut' draggable='false'>";
    document.getElementById('cribcut').innerHTML = "<img src=Cards/"+ct+".png class='card cut' draggable='false'>";


    // crib calculations
    // hand stats
    let newHand = [...handCards];
    newHand.splice(scoreList[14].throws[1],1);
    newHand.splice(scoreList[14].throws[0],1);
    let rawHand = [...newHand];
    newHand.push(cut);

    // better or same as XX.xx percent of calculations
    let finalHandScore = score(newHand, dealing, false);

    let compareCuts = [...allCards];
    for(let i=0;i<6;i++){
      compareCuts = cardRemove(compareCuts, handCards[i]);
    }
    let lowDensity = 0;
    let highDensity = 0;
    for(let x=0;x<compareCuts.length;x++){
      if(score([...rawHand].concat(compareCuts[x]), dealing, false)<finalHandScore){
        lowDensity++;
        highDensity++;
      } else if(score([...rawHand].concat(compareCuts[x]), dealing, false)==finalHandScore){
        highDensity++;
      }
    }



    let handstatsHTML = "<h2>Updated Hand Stats:</h2><p>Hand Score: <span class='stat'>"+finalHandScore+"</span> Points (Min: <span class='stat'>"+Math.min(...scoreList[14].handscores)+"</span>, Avg: <span class='stat'>"+([...scoreList[14].handscores].reduce((a,b)=>a+b,0)/scoreList[14].handscores.length).toFixed(3)+"</span>, Max: <span class='stat'>"+Math.max(...scoreList[14].handscores)+"</span>)</p><p><span class='stat'>"+detailedScore(newHand, dealing, false, true)+"</span></p><p>Cut in top <span class='stat'>"+(lowDensity*100/compareCuts.length).toFixed(1)+"</span>-<span class='stat'>"+(highDensity*100/compareCuts.length).toFixed(1)+"%</span> of all cuts, <span class='stat'>"+(highDensity-lowDensity)+['</span> cuts get you here','</span> cut gets you here'][(highDensity-lowDensity)>1?0:1]+"</p>";


    //crib stats

    let newCribStats = [];
    let newCutMin = 0;
    let newCutAv = 0;
    let newCutMax = 0;
    let cribThrows = [handCards[scoreList[14].throws[0]],handCards[scoreList[14].throws[1]]];
    compareCuts = [...allCards];
    for(let i=0;i<6;i++){
      compareCuts = cardRemove(compareCuts, handCards[i]);
    }

    for(let x=0;x<compareCuts.length;x++){
      let opThrows = [...compareCuts];
      let tempList = [];
      opThrows = cardRemove(opThrows, compareCuts[x]);
      for(let ot1=0;ot1<opThrows.length-1;ot1++){
        for(let ot2=ot1+1;ot2<opThrows.length;ot2++){
          tempList.push((dealing?1:-1)*score([...cribThrows].concat([opThrows[ot1], opThrows[ot2], compareCuts[x]]), dealing, true))
        }
      }
      if(compareCuts[x].n == cut.n && compareCuts[x].s == cut.s){
        newCutMin = Math.min(...tempList);
        newCutAv = [...tempList].reduce((a,b)=>a+b,0)/tempList.length;
        newCutMax = Math.max(...tempList);
      }
      newCribStats.push([...tempList].reduce((a,b)=>a+b,0)/tempList.length);
    }

    lowDensity = 0;
    highDensity = 0;
    for(let x=0;x<newCribStats.length;x++){
      if(newCutAv>newCribStats[x]){
        lowDensity++;
        highDensity++;
      } else if(newCutAv==newCribStats[x]){
        highDensity++;
      }
    }


    let cribstatsHTML = "<h2>Updated Crib Stats:</h2><p>Worst: <span class='stat'>"+Math.abs(Math.min(...scoreList[14].cribscores))+"</span>➔<span class='stat'>"+Math.abs(newCutMin)+"</span> Points</p><p>Average: <span class='stat'>"+Math.abs([...scoreList[14].cribscores].reduce((a,b)=>a+b,0)/scoreList[14].cribscores.length).toFixed(3)+"</span>➔<span class='stat'>"+Math.abs(newCutAv).toFixed(3)+"</span> Points</p><p>Best: <span class='stat'>"+Math.abs(Math.max(...scoreList[14].cribscores))+"</span>➔<span class='stat'>"+Math.abs(newCutMax)+"</span> Points</p><p>Cut in top <span class='stat'>"+(lowDensity*100/newCribStats.length).toFixed(1)+"</span>-<span class='stat'>"+(highDensity*100/newCribStats.length).toFixed(1)+"%</span> of all cuts, <span class='stat'>"+(highDensity-lowDensity)+['</span> cuts get you here','</span> cut gets you here'][(highDensity-lowDensity)>1?0:1]+"</p>";


    document.getElementById('handstats').innerHTML = handstatsHTML;
    document.getElementById('cribstats').innerHTML = cribstatsHTML;

  }
}
main();