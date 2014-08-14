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
		can.getFormData = function($form)
		{
				return	can.deparam(
							$form.serialize()
						)
		}
	}
)