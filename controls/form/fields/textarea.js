define(
	[
		'controls/form/fields/field'
	]
,	function()
	{
		/*
			@nombre
			Frame.Fields.Textarea
			
			@descripción
			Controlador hijo de Frame.Field.
			Controlador para campos del tipo textarea.
			
			@utilización
			Genera una instancia del tipo de campo Textarea
		*/
		Frame.Field(
			'Frame.Fields.Textarea'
		,	{
				//	Como es hijo de Frame.Fields hereda tanto los defaults como sus funciones.
			}
		,	{
				//	Renderiza el Input, obtiene como parametro donde lo voy a renderizar
				_render_field: function($where)
				{
					//	Creo el elemento HTML del input y le agrego las clases y atributos que correspondan.
					can.$('<textarea>')
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
							,	(this.options.placeholder)	//	Valido que tenga placeholder, si tiene paso un objeto con placeholder y sino un objeto vacio
								?	{
										placeholder: this.options.placeholder
									}
								:	{}
							,	(this.options.row)	//	Valido que tenga row, si tiene paso un objeto con row y sino un objeto vacio
								?	{
										row: this.options.row
									}
								:	{}
							)
						)
						.appendTo(
							$where
						)
				}
			}
		)
	}
)