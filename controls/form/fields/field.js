define(
	[
		'lib/util'
	]
,	function()
	{
		/*
			@nombre
			Frame.Field
			
			@descripción
			Controlador padre de todos los campos.
			
			
			@utilización
			Se debe de generar una Sublclase para que tenga sentido.
		*/
		can.Control(
			'Frame.Field'
		,	{
				defaults:
				{
					label_size: 	3		//	@tipo Integer	@descripcion Tamaño de la columna del labal (Solo Horizontal)
				,	input_size: 	9		//	@tipo Integer	@descripcion Tamaño de la columna del input (Solo Horizontal)
				,	name:			false	//	@tipo String	@descripcion Nombre del Field (Obligatorio)
				,	id:				false	//	@tipo String	@descripcion ID unico para el campo
				,	placeholder:	false	//	@tipo String	@descripcion Marcado que figurara en el campo
				,	type:			false	//	@tipo String	@descripcion Tipo de Estructura HTML (inline, horizontal)
				,	validations:	false 	//	@tipo Array		@descripcion conjunto de validaciones ('integer',function,etc)
				,	'class':		false	//	@tipo String	@descripcion Clase auxiliar para el campo
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
							this._render_simple()
					}
				}
				//	Obtiene el tipo, hace referencia al tipo de campo input (text, checkbox, autocomplete, etc)
			,	getType: function()
				{
					//	Seteado a false ya que este controlador es el controlador padre del resto de clases inputs, por si solo no hace nada!
					return	false
				}
				//	Obtiene la clase responsiva del Label (http://getbootstrap.com/css/#grid)
			,	getLabelClass: function()
				{
					var	n
					=	this.options.label_size
					return	'col-xs-'+n+' col-sm-'+n+' col-md-'+n+' col-lg-'+n
				}
				//	Obtiene la clase responsiva del input (http://getbootstrap.com/css/#grid)
			,	getInputClass: function()
				{
					var	n
					=	this.options.input_size
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
					//	Renderizo el input dentro del elemento
					this._render_field(this.element)
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
							.addClass(this.getInputClass())
							.appendTo(
								this.element
							)
					//	Renderizo el Input dentro del elemento HTML creado
					this._render_field($innerGroup)
				}
				//	Crea la estructura HTML para el tipo de formulario en caso de que no sea horizontal o inline.
			,	_render_simple: function()
				{
					//	Renderizo el Label dentro del elemento
					this._render_label(this.element)
					//	Renderizo el Input dentro del elemento
					this._render_field(this.element)
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
			}
		)
	}
)