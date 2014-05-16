define(
	[
		'lib/util'
	,	'typeahead'
	]
,	function()
	{
		/*
			@nombre
			Frame.Autocomplete
			
			@descripción

			Manejo de un Autocomplete, Utiliza un plugin externo. typeahead.js
			
			@utilización

			Se debe instanciar el controlador en un input.
		*/

		can.Control(
			'Frame.Autocomplete'
		,	{
				defaults:
				{
				//	source:	@tipo Array|Deferred|Function	@descripcion	Fuente de donde extraer la informacion
					source:				[]
				//	resto:	ver https://github.com/bassjobsen/Bootstrap-3-Typeahead
				,	items:				8
				,	minLength:			3
				,	showHintOnFocus:	true
				,	scrollHeight:		0	
				,	matcher:			undefined
				,	sorter:				undefined
				,	updater:			undefined
				,	highlight:			true
				,	autoSelect:			true
				,	delay:				250
				}
			}
		,	{
				init: function()
				{
					//	Valida si source es un deferred, si asi lo debera resolver primero
					if	(can.isDeferred(this.options.source))
						this._render_deferred()
					else
						this._render_autocomplete()
				}
			//	Como source es un deferred, lo resuelve
			,	_render_deferred: function()
				{
					var	self
					=	this
					//	Resuelve el deferred
					this
						.options
							.source
								.then(
									function(data)
									{
										//	Realiza un backup del source original
										self.source = this.options.source
										//	Actualiza el valor de source
										self.options.source = data
										//	Renderiza el autocomplete
										self._render_autocomplete()
									}
								)
				}
			//	Crea la instancia del autocomplete en el input
			,	_render_autocomplete: function()
				{
					//	Instancia el autocomplete de Bootstrap-3-Typeahead.js (https://github.com/bassjobsen/Bootstrap-3-Typeahead) 
					this
						.element
							.typeahead(
								//	Extiende los parametros por defecto con source
								can.extend(
									//	La funcion pick de lodash (http://lodash.com/docs) crea un objeto partiendo de options y selecciona solo los atributos dentro del array
									_.pick(
										this.options
									,	['items','minLength','showHintOnFocus','scrollHeight','matcher','sorter','updater','highlight','autoSelect']
									)
								,	{
										//	Obtengo la fuente (data o funcion)
										source:	this.getSource()
									}
								)
							)
				}
			//	Valida si source es una funcion y genera la nueva funcion on query y callback 
			,	getSource: function()
				{
					return	can.isFunction(this.options.source)
							?	can.proxy(this.getSourceFunction,this)
							:	this.options.source
				}
			//	Nueva funcion con query y callback tal cual como la espera el plugin typeahead.js
			,	getSourceFunction: function(query,callback)
				{
					return	this
								.options
									.source(query)
										.then(
											callback
										)
				}
			}
		)
	}
)