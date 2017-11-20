$(document).ready(function() {
    $('select').material_select();
    getReleases(plot, 'now')
  });
        

moment.lang('en', {week: {dow: 1}}); //seta segunda feira como primeiro dia da semana
var now = moment(),
	weekStart = moment().startOf('week'),
  	weekEnd = moment().endOf('week'),
 	monthStart = moment().startOf('month'),
  	monthEnd = moment().endOf('month');
var releases = [];
var categories = [];

function webRequest(url, callback, type = 'GET', callback_data = null) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(this.responseText);
      callback(this.responseText, callback_data);
    }
  };
  xhttp.open(type, url, true);
  xhttp.send();
}

function showCard(el){
	var cards = ['.graph-container', '.history-container', '.newrelease-container', '.newcategory-container'];
	cards.map( (card) => {
		$(card).hide();
	});
	$( $(el).data('show') ).show();
}

// function _getReleasesCallback(request){
// 	JSON.parse( request ).body.map( (release) => {
// 		releases.push(release);
// 	});
// 	console.log(releases);

// }

//getReleases(plot, 'week');
function getReleases(callback, callback_period = null){
	releases = [];
    local = JSON.parse(localStorage.getItem('user'));
    url = 'http://localhost:8000/api/user/releases?user_id=' + local.id;
    //console.log(url);
    webRequest(url, callback, 'POST', callback_period);
}

function getCategories(callback, callback_data = null){
	categories = [];
    local = JSON.parse(localStorage.getItem('user'));
    url = 'http://localhost:8000/api/category/all';
    //console.log(url);
    webRequest(url, callback, 'POST', callback_data);
}

function release(){
	var user = JSON.parse(localStorage.getItem('user'));
	var data = {
		"user_id" : user.id,
		"method_id" : $('#method_id').val(),
		"description" : $('#description').val(),
		"value" : $('#value').val(),
		"category_id" : $('#category_id').val()
	};

	var request = $.ajax({
	  url: "http://localhost:8000/api/release/create",
	  method: "POST",
	  data: data,
	  dataType: "json"
	});
	 
	request.done(function( msg ) {
		$('#description').val('');
		$('#value').val('0.00');
		alert('Sucesso!');
	 	//console.log(msg);
	});
	 
	request.fail(function( jqXHR, textStatus ) {
	  alert( "Request failed: " + textStatus );
	});
}

function createCategory(){
	var data = {
		"name" : $('#category-name').val(),
		"description" : $('#category-description').val()
	};
	console.log(data);

	var request = $.ajax({
	  url: "http://localhost:8000/api/category/create",
	  method: "POST",
	  data: data,
	  dataType: "json"
	});
	 
	request.done(function( msg ) {
		$('#category-name').val('');
		$('#category-description').val('');
		alert('Sucesso!');
	 	//console.log(msg);
	});
	 
	request.fail(function( jqXHR, textStatus ) {
	  alert( "Request failed: " + textStatus );
	});
}

function showNewRelease(request, el){
	var show = $(el).data('show');
	JSON.parse( request ).body.map( (c) => { //popula o array
		categories.push(c);
	});

	var data = '';
	categories.map( (c) => {
		var template = `<option value="$id">$name</option>`;
        template = template.replace('$id', c.id);
        template = template.replace('$name', c.name);
        data += template;
	});
	releaseContainer = $( '#category_id' ).html(data);
    $('#category_id').material_select();
	showCard(el);
}

function showHistory(request, el){
	var show = $(el).data('show');
	JSON.parse( request ).body.map( (release) => { //popula o array
		releases.push(release);
	});

	var tableTemplate = `<table class="striped centered">
			              <thead>
			                <tr>
			                  <th>Descrição</th>
			                  <th>Categoria</th>
			                  <th>Data</th>
			                  <th>Valor</th>
			                </tr>
			              </thead>
			              <tbody>
			              	$data
			              </tbody>
			        </table>`;

	var data = '';
	releases.map( (release) => {
		var template = `<tr>
		                  <td>$description</td>
		                  <td>$category_name</td>
		                  <td>$created_at</td>
		                  <td>R$$value</td>
               			</tr>`;
        template = template.replace('$category_name', release.category.name);
        template = template.replace('$description', release.description);
        template = template.replace('$created_at', release.created_at);
        template = template.replace('$value', release.value);
        data += template;
	});
	tableTemplate = tableTemplate.replace("$data", data);	
	historyContainer = $( show + ' table' ).html(tableTemplate);
	showCard(el);
	//console.log(tableTemplate);
}

var myChart = null;
function plot(request, period){ //period = now, week, month
	JSON.parse( request ).body.map( (release) => { //popula o array
		releases.push(release);
	});
	//console.log(releases,period);

	if(releases == []){ //nada pra exibir
		console.log('empty');
		return;
	}

	releasesby_category = [];
	//console.log(releases);
	releases.map( (release) => { //releases dividos por categoria
		var created_at = moment(release.created_at);
		switch(period){
			case 'now':
				if( !( moment(created_at).isSame(moment(), 'day') ) )
					return;
			break;
			case 'week':
				if( !(created_at >= weekStart && created_at <= weekEnd) ){
					//console.log(created_at);
					return;
				}
			break;
			case 'month':
				if( !(created_at >= monthStart && created_at <= monthEnd) )
					return;
			break;
			default:
			break;
		}

		release_name = release.category.name;
		console.log(release);
		releasesby_category[release_name] = ( releasesby_category[release_name] != undefined ) ? releasesby_category[release_name] : [];
		releasesby_category[release_name].push(release);
	});
	//console.log(releasesby_category);
	if(releasesby_category == []){ //nada pra exibir
		//console.log('empty for this period');
		return;
	}

	releasesdata = []; //numeros dividos por categoria
	labels = [];
	data = [];
	for (var key in releasesby_category) {
		var total = 0;
		releasesby_category[key].map( (release_obj) => {
			total += parseFloat(release_obj.value);
		});
		releasesdata[key] = total;
		labels.push(key);
		data.push(total);
	}

	if(myChart != null)
		myChart.destroy();

	var ctx = document.getElementById("myChart");
	myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: labels,
	        datasets: [{
	            label: '',
	            data: data,
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	                'rgba(215, 92, 112, 0.2)',
	                'rgba(153, 102, 255, 0.2)',
	                'rgba(255, 159, 64, 0.2)',
	                'rgba(200, 159, 64, 0.2)',
	                'rgba(255, 50, 64, 0.2)',
	                'rgba(155, 159, 14, 0.2)',

	                'rgba(100, 20, 239, 0.2)',
	                'rgba(200, 120, 14, 0.2)',
	                'rgba(0, 200, 4, 0.2)',
	                'rgba(50, 250, 14, 0.2)',
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(105, 159, 14, 1)',
	                'rgba(100, 199, 64, 1)',
	                'rgba(80, 159, 204, 1)',
	                'rgba(180, 59, 104, 1)',

	                'rgba(120, 189, 164, 0.2)',
	                'rgba(2, 19, 64, 0.2)',
	                'rgba(55, 250, 14, 0.2)',
	                'rgba(15, 159, 134, 0.2)',
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
}



init();
function init(){
  if(localStorage.getItem('user') == null){
    	location.href = '../login/index.html'; 
    	return;
    }   
    document.getElementById('display_name').innerHTML = ' Bem vindo(a), ' + JSON.parse( localStorage.getItem('user') ).name;
}

function logout(){
	localStorage.clear();
}