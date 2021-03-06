define(
	[
		'can/construct'
	,	'can/construct/super'
	,	'can/control'
	,	'can/view'
	,	'can/view/mustache'
	,	'lodash'
	]
,	function()
	{
		//	DEF Frame
		Frame = {}
		//	Toggle del atributo disabled
		$.fn.toggleDisabled
		=	function()
			{
				return	this
							.each(
								function()
								{
									this.disabled	=	!this.disabled;
								}
							)
			}
		//	Cuenta la cantidad de atributos que hay en un objeto.
		can.objectLength = function(ob)
		{
			var count = 0;
			for (var k in ob) {
				if (ob.hasOwnProperty(k)) {
					++count;
				}
			}
			return	count
		}
		//	Obtiene los datos del formulario
		can.getFormData = function($form,visible)
		{
			var formData
			=	can.deparam(
						$form.serialize()
					)
			return	visible
					?	_.omit(
							formData
						,	_.filter(
								_.keys(formData)
							,	function(key,index)
								{
									return	!($form.find('[name='+key+']').is(':visible'))
								}
							)
						)
					:	formData 

		}
		//	Resetea un formulario
		can.resetForm = function($form)
		{
			return	$form[0].reset()
		}
	}
)