define(
	[
		'lib/util'
	]
,	function()
	{
		/*
			@nombre
			Frame.Fields.Select
			
			@descripción
			Controlador padre de todos los campos del tipo Select.
			
			
			@utilización
			Se debe de generar una Sublclase para que tenga sentido.
		*/
		can.Control(
			'Frame.Fields.Select'
		,	{
				defaults:
				{
					label_size: 	3		//	@tipo Integer			@descripcion Tamaño de la columna del labal (Solo Horizontal)
				,	select_size: 	9		//	@tipo Integer			@descripcion Tamaño de la columna del Select (Solo Horizontal)
				,	name:			false	//	@tipo String			@descripcion Nombre del Field (Obligatorio)
				,	id:				false	//	@tipo String			@descripcion ID unico para el campo
				,	placeholder:	false	//	@tipo String			@descripcion Marcado que figurara en el campo (Primera opcion con value = "placeholder")
				,	type:			false	//	@tipo String			@descripcion Tipo de Estructura HTML (inline, horizontal)
				,	validations:	false 	//	@tipo Array				@descripcion conjunto de validaciones ('integer',function,etc)
				,	'class':		false	//	@tipo String			@descripcion Clase auxiliar para el campo
				,	multiple:		false	//	@tipo Boolean			@descripcion Determina si el tipo de select es multiple
				,	data:			false	//	@tipo Array|Deferred	@descripcion Opciones del Select
				}
			}
		,	{
				//	Inicializo el controlador, verifico que tipo de campo voy a renderizar, y llamo a la funcion correspondiente
				init: function(element,options)
				{
					switch(options.type)
					{
						case 'inline':
							this._render_inline()
							break;
						case 'horizontal':
							this._render_horizontal()
							break;
						default:
							this._render_field()
					}
				}
				//	Obtiene la clase responsiva del Label (http://getbootstrap.com/css/#grid)
			,	getLabelClass: function()
				{
					var	n
					=	this.options.label_size
					return	'col-xs-'+n+' col-sm-'+n+' col-md-'+n+' col-lg-'+n
				}
				//	Obtiene la clase responsiva del select (http://getbootstrap.com/css/#grid)
			,	getSelectClass: function()
				{
					var	n
					=	this.options.select_size
					return	'col-xs-'+n+' col-sm-'+n+' col-md-'+n+' col-lg-'+n
				}
				//	Crea la estructura HTML para el tipo de formulario Inline
			,	_render_inline: function()
				{
					//	Renderiza el label dentro del elemento
					this._render_label(this.element)
					//	Le agrega al label la clase sr-only, lo que provocara que se oculte
					this
						.element
							.find('label')
								.addClass('sr-only')
					//	Verifico si se paso un placeholder, si no se paso, seteo al label como placeholder.
					this.options.placeholder = this.options.placeholder || this.options.label
					//	Renderizo el select dentro del elemento
					this._render_select(this.element)
				}
				//	Crea la estructura HTML para el tipo de formulario Horizontal
			,	_render_horizontal: function()
				{
					//	Renderizo el label dentro del elemento
					this._render_label(this.element)
					//	Le agrego al label la clase control-label y la clase de la primer columna de la  grilla responsiva.
					this
						.element
							.find('label')
								.addClass('control-label')
								.addClass(this.getLabelClass())
					//	Creo un elemento HTML para generar la segunda columna de la grilla responsiva.
					var	$innerGroup
					=	can.$('<div>')
							.addClass(this.getSelectClass())
							.appendTo(
								this.element
							)
					//	Renderizo el select dentro del elemento HTML creado
					this._render_select($innerGroup)
				}
				//	Crea la estructura HTML para el tipo de formulario en caso de que no sea horizontal o inline.
			,	_render_field: function()
				{
					//	Renderizo el label dentro del elemento
					this._render_label(this.element)
					//	Renderizo el select dentro del elemento
					this._render_select(this.element)
				}
				//	Renderiza el Label, obtiene como parametro donde voy a renderizarlo.
			,	_render_label: function($where)
				{
					//	Creo el elemento HTML del label y lo inserto dentro del elemento pasado como argumento.
					can.$('<label>')
						.html(this.options.label)
						.attr('for',this.options.name)
						.appendTo(
							$where
						)
				}
				//	Renderiza el select, obtiene como parametro donde lo voy a renderizar
			,	_render_select: function($where)
				{
					//	Creo el elemento HTML del select y le agrego las clases y atributos que correspondan.
					this.$select
					=	can.$('<select>')
							.addClass('form-control '+(this.options['class'] ||''))
							.attr(
								can.extend(
									{
										name: this.options.name
									}
								,	(this.options.id)			//	Valido que tenga ID, si tiene paso un objeto con ID y sino un objeto vacio
									?	{
											id: this.options.id
										}
									:	{}
								,	(this.options.multiple)		//	Valido que el select sea multiple
									?	{
											multiple: 'multiple'
										}
									:	{}
								)
							)
							.appendTo(
								$where
							)
					//	Renderizo el placeholder
					if	(this.options.placeholder)
						this._render_option({value: 'placeholder', label: this.options.placeholder})
					//	Verifico si options.options es un deferred o un array y llamo a _render_options
					if	(can.isDeferred(this.options.options))
						this
							.options
								.options
									.then(
										can.proxy(this._render_options,this)
									)
					else
						this._render_options(this.options.options)
				}
				//	Renderiza las opciones del select, obtiene como parametro las opciones
			,	_render_options: function(options)
				{
					//	Recorro las opciones y llamo a _render_option
					can.each(
						options
					,	can.proxy(this._render_option,this)
					)
				}
				//	Renderiza la opcion, tiene como parametro, la opcion a renderizar
			,	_render_option: function(option)
				{
					can.$('<option>')
						.attr(
							'value'
						,	can.isFunction(option.getValue)
							? 	option.getValue()
							:	option[this.options.value_key || 'value']
						).html(
							can.isFunction(option.getLabel)
							? 	option.getLabel()
							:	option[this.options.label_key || 'label']
						).appendTo(
							this.$select
						)
				}
			}
		)
	}
)