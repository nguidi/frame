define(
	[
		'controls/form/fields/field'
	]
,	function()
	{
		/*
			@nombre
			Frame.Fields.Button
			
			@descripción
			Controlador hijo de Frame.Field.
			Controlador para campos del tipo boton.
			
			@utilización
			Genera una instancia del tipo de campo boton
		*/
		Frame.Field(
			'Frame.Fields.Button'
		,	{
				//	Como es hijo de Frame.Fields hereda tanto los defaults como sus funciones.
			}
		,	{
				//	Renderiza el Input, obtiene como parametro donde lo voy a renderizar
				_render_field: function($where)
				{
					//	Creo el elemento HTML del boton y le agrego las clases que correspondan.
					var $button
					=	can.$('<button>')
							.addClass('btn '+(this.options['class'] ||'btn-default'))
							.html(
								this.options.label
							)
					//	Verifico si el boton es del tipo submit y si asi le agrego el tupo
					if	(this.options.submit)
						$button.attr('type','submit')
					//	Inserto el boton en $where
					$button
						.appendTo(
							$where
						)
				}
			}
		)
	}
)