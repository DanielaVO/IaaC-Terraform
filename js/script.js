var Formulario = {};

(function(){

	Formulario.suscriptionid;

	Formulario.clientId;

	Formulario.clientSecret;

	Formulario.tenantId;

	Formulario.name;

	Formulario.location;

	Formulario.nameNet;

	Formulario.nameSub;

	Formulario.nameInter;

	Formulario.nameConf;

	Formulario.nameMV;

	Formulario.publisher;

	Formulario.offer;

	Formulario.sku;

	Formulario.admin;

	Formulario.password;

	Formulario.data = [];

	/**
	* Función que se llama cuando se termina la carga del DOM
	*/
	Formulario.initializer = function(){
		$('#btnSend').click(Formulario.getFields);
		$('input').keyup(Formulario.getKeyPressedListener);
	}

	/**
	* Obtiene los campos y los mete un arreglo.
	*/
	Formulario.getFields = function(){
		Formulario.data = [];
		Formulario.suscriptionid = $('#suscriptionId').val();
		Formulario.clientId =  $('#clientId').val();
		Formulario.clientSecret = $('#clientSecret').val();
		Formulario.tenantId = $('#tenantId').val();
		Formulario.name = $('#name').val();
		Formulario.location = $('#location').val();
		Formulario.nameNet = $('#nameNet').val();
		Formulario.nameSub = $('#nameSub').val();
		Formulario.nameInter = $('#nameInter').val();
		Formulario.nameConf = $('#nameConf').val();
		Formulario.nameMV = $('#nameMV').val();
		Formulario.publisher = $('#publisher').val();
		Formulario.offer = $('#offer').val();
		Formulario.sku = $('#sku').val();
		Formulario.admin = $('#admin').val();
		Formulario.password = $('#password').val();
		Formulario.data.push(Formulario.suscriptionid); //0
		Formulario.data.push(Formulario.clientId);		//1
		Formulario.data.push(Formulario.clientSecret);	//2
		Formulario.data.push(Formulario.tenantId);		//3
		Formulario.data.push(Formulario.name);			//4
		Formulario.data.push(Formulario.location);		//5
		Formulario.data.push(Formulario.nameNet);		//6
		Formulario.data.push(Formulario.nameSub);		//7
		Formulario.data.push(Formulario.nameInter);		//8
		Formulario.data.push(Formulario.nameConf);		//9
		Formulario.data.push(Formulario.nameMV);		//10
		Formulario.data.push(Formulario.publisher);		//11
		Formulario.data.push(Formulario.offer);			//12
		Formulario.data.push(Formulario.sku);			//13
		Formulario.data.push(Formulario.admin);			//14
		Formulario.data.push(Formulario.password);		//15
		Formulario.sendData();
	}

	/**
	* Envía datos para se capturados en el servidor
	*/
	Formulario.sendData = function(){
		$.ajax({
			url: 'http://127.0.0.1:8080/firstPath',
			type: 'POST',
			data: "data=" + Formulario.data,
			success: function(response){
				alert(response);
			}
		});
	}

	/**
	* Evento que recibe el presionado de las teclas
	**/
	Formulario.getKeyPressedListener = function(){
		let itemId = $(this)[0].id;
		let text = $(this).val();
		/*if(text.length > 0){
			text = '"' + text + '"';
		}else{
			text = "";
		}*/
		$('.' + itemId + '_text').text(text);
	}

})();


$(function() {
	Formulario.initializer();
});

