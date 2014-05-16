define(
	[
		'controls/form/fields/field'
	]
,	function()
	{
		/*
			@nombre
			Frame.Fields.Checkbox
			
			@descripción
			Controlador hijo de Frame.Field.
			Controlador para campos del tipo checkbox.
			
			@utilización
			Genera una instancia del tipo de campo Checkbox
			Tiene dos modalidades
				1.	Un Label con varios checkbox, cada uno con su label.
				2.	Un Checkbox con label.
		*/
		Frame.Field(
			'Frame.Fields.Checkbox'
		,	{
				//	Como es hijo de Frame.Fields.Input hereda tanto los defaults como sus funciones.
				//	Sin embargo, checkbox tiene comportamiento extra.
				//	Extiendo el defaults de Frame.Fields.Input
				defaults:
				{
					options:	false	//	@tipo Array		@descripcion conjunto de checkbox ('integer',function,etc)
				,	multiple:	false	//	@tipo Buleano	@descripcion define si es multiple o no el checkbox	
				}
			}
		,	{
				//	Devuelve el tipo de campo, el cual es checkox.
				getType: function()
				{
					return	'checkbox'
				}
				//	Crea la estructura HTML para el tipo de formulario Inline
			,	_render_inline: function()
				{
					//	Renderizo los checkboxs
					this._render_checkboxs(this.element)
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
					//	Renderizo los checkboxs
					this._render_checkboxs($innerGroup)
				}
				//	Crea la estructura HTML para el tipo de formulario en caso de que no sea horizontal o inline.
			,	_render_simple: function()
				{
					//	Renderizo el Label
					this._render_control_label(this.element)
					//	Renderizo un salto de linea
					this.element.append(can.$('</br>'))
					//	Renderizo los radio
					this._render_checkboxs(this.element)
				}
				//	Crea la estructura HTML para el tipo de formulario en caso de que no sea horizontal o inline.
			,	_render_field: function()
				{
					//	Renderizo los checkboxs
					this._render_checkboxs(this.element)
				}
				//	Renderiza el Control Label, se utilza en el form horizontal para armar una distancia entre el campo y el label.
			,	_render_control_label: function($where)
				{
					//	Verifico si tiene label, si tiene creo un label con grid, sino solo un div con grid.
					var	$leftControl
					=	(this.options.multiple && this.options.label)
						?	can.$('<label>').html(this.options.label)
						:	can.$('<div>')
					//	Le agrego las clases correspondiente y lo inserto en el HTML
					$leftControl
						.addClass('control-label')
						.addClass((this.options.type == 'horizontal') ? this.getLabelClass() : '')
						.appendTo(
							$where
						)
				}
			,	_render_checkboxs: function($where)
				{
					//	Seteo a this en la variable global self para poder usarla dentro del can.each
					var	self
					=	this
					//	Verifico si es un checkbox multiple
					if	(this.options.multiple)
						//	Si tengo n checkobx llamo a render n veces (n > 1).
						can.each(
							this.options.options
						,	function(checkbox)
							{
								self._render_checkbox($where,checkbox)
							}
						)
					else
						//	Renderizo el input dentro del label
						this._render_checkbox(self.element)
				}
				//	Renderiza el checkbox, obtiene como parametro donde voy a renderizarlo y de forma opcional checkbox.
			,	_render_checkbox: function($where,checkbox)
				{
					//	Renderizo el Label del Checkbox
					this._render_label($where,checkbox)
					//	Inserto el checkbox en el label que corresponde
					$where
						.find('label[for='+checkbox.name+']')
						.addClass('checkbox-inline')
							.prepend(
								this._render_input(checkbox || this.options)
							)
				}
				//	Renderiza el Label, obtiene como parametro donde voy a renderizarlo  y de forma opcional checkbox.
			,	_render_label: function($where,checkbox)
				{
					//	Creo el elemento HTML del label y lo inserto dentro del elemento pasado como argumento.
					//	Como el parametro checkbox es opcional, verifico si esta.
					can.$('<label>')
						.html(checkbox ? checkbox.label : this.options.label)
						.attr('for',checkbox ?  checkbox.name : this.options.name)
						.appendTo(
							$where
						)
				}
				//	Renderiza el Input, obtiene como parametro el checkbox a renderizar
			,	_render_input: function(checkbox)
				{
				 	//	Creo el elemento HTML del input y le agrego las clases y atributos que correspondan.
				 	return	can.$('<input>')
								.addClass(checkbox['class'] || '')
								.attr(
									can.extend(
										{
											type:	this.getType()
										,	name:	checkbox.name
										,	value:	checkbox.value
										,	checked:	checkbox.checked 
										}
									,	(checkbox.id)			//	Valido que tenga ID, si tiene paso un objeto con ID y sino un objeto vacio
										?	{
												id: checkbox.id
											}
										:	{}
									)
								)
				}
			}
		)
	}
)