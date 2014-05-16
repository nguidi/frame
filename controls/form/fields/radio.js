define(
	[
		'controls/form/fields/field'
	]
,	function()
	{
		/*
			@nombre
			Frame.Fields.Radio
			
			@descripción
			Controlador hijo de Frame.Field.
			Controlador para campos del tipo radio.
			
			@utilización
			Genera una instancia del tipo de campo Radio
		*/
		Frame.Field(
			'Frame.Fields.Radio'
		,	{
				//	Como es hijo de Frame.Fields.Input hereda tanto los defaults como sus funciones.
				//	Sin embargo, radio tiene comportamiento extra.
				//	Extiendo el defaults de Frame.Fields.Input
				defaults:
				{
					options:	false	//	@tipo Array		@descripcion conjunto de radio ('integer',function,etc)
				,	multiple:	false	//	@tipo Buleano	@descripcion define si es multiple o no el radio	
				}
			}
		,	{
				_render_inline: function()
				{
					//	Renderizo el Label
					this._render_control_label(this.element)
					//	Renderizo los radio
					this._render_radios(this.element)
				}
				//	Crea la estructura HTML para el tipo de formulario Horizontal
			,	_render_horizontal: function()
				{
					//	Renderizo el control label (label opcional) dentro del elemento
					this._render_control_label(this.element)
					//	Creo un elemento HTML para generar la segunda columna de la grilla responsiva.
					var	$innerGroup
					=	can.$('<div>')
							.addClass(this.getInputClass())
							.appendTo(
								this.element
							)
					//	Renderizo los radios
					this._render_radios($innerGroup)
				}
				//	Crea la estructura HTML para el tipo de formulario en caso de que no sea horizontal o inline.
			,	_render_simple: function()
				{
					//	Renderizo el Label
					this._render_control_label(this.element)
					//	Renderizo un salto de linea
					this.element.append(can.$('</br>'))
					//	Renderizo los radio
					this._render_radios(this.element)
				}
				//	Renderiza el Control Label, se utilza en el form horizontal para armar una distancia entre el campo y el label.
			,	_render_control_label: function($where)
				{
					//	Verifico si tiene label, si tiene creo un label con grid, sino solo un div con grid.
					var	$leftControl
					=	can.$('<label>').html(this.options.label)
					//	Le agrego las clases correspondiente y lo inserto en el HTML
					$leftControl
						.addClass('control-label')
						.addClass((this.options.type == 'horizontal') ? this.getLabelClass() : '')
						.appendTo(
							$where
						)
				}
			,	_render_radios: function($where)
				{
					//	Seteo a this en la variable global self para poder usarla dentro del can.each
					var	self
					=	this
					//	Si tengo n radio llamo a render n veces (n > 1).
					can.each(
						this.options.options
					,	function(radio)
						{
							self._render_radio($where,radio)
						}
					)
				}
				//	Renderiza el radio, obtiene como parametro donde voy a renderizarlo y de forma opcional radio.
			,	_render_radio: function($where,radio)
				{
					//	Renderizo el Label del radio
					this._render_label($where,radio)
					//	Inserto el radio en el label que corresponde
					$where
						.find('label[for='+this.options.name+']')
						.addClass('radio-inline')
							.prepend(
								this._render_field(radio || this.options)
							)
				}
				//	Renderiza el Label, obtiene como parametro donde voy a renderizarlo  y de forma opcional radio.
			,	_render_label: function($where,radio)
				{
					//	Creo el elemento HTML del label y lo inserto dentro del elemento pasado como argumento.
					//	Como el parametro radio es opcional, verifico si esta.
					can.$('<label>')
						.html(radio ? radio.label : this.options.label)
						.attr('for',this.options.name)
						.appendTo(
							$where
						)
				}
				//	Renderiza el Input, obtiene como parametro el radio a renderizar
			,	_render_field: function(radio)
				{
				 	//	Creo el elemento HTML del input y le agrego las clases y atributos que correspondan.
				 	return	can.$('<input>')
								.addClass(radio['class'] || '')
								.attr(
									can.extend(
										{
											type: 'radio'
										,	name: this.options.name
										,	value:	radio.value
										,	checked:	radio.checked 
										}
									,	(radio.id)			//	Valido que tenga ID, si tiene paso un objeto con ID y sino un objeto vacio
										?	{
												id: radio.id
											}
										:	{}
									)
								)
				}
			}
		)
	}
)