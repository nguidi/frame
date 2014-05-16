define(
	[
		'lib/util'
	,	'controls/form/fields/text'
	,	'controls/form/fields/password'
	,	'controls/form/fields/checkbox'
	,	'controls/form/fields/radio'
	,	'controls/form/fields/select'
	,	'controls/form/fields/autocomplete'
	,	'controls/form/fields/date'
	,	'controls/form/fields/textarea'
	]
,	function()
	{
		/*
			@nombre
			Frame.Form
			
			@descripción

			Manejo de Formularios, renderiza un formulario, espera acciones del usuario, valida contenidos y devuelve el form serializado.
			
			@utilización

			Se debe instanciar el controlador en un elemento html (form o no), se pasaran como argumentos, el tipo de formulario, los campos
			del formulario, las validaciones por campo, las validaciones propias del form y la accion a realizar al momento de submitear el
			formulario.
		*/

		can.Control(
			'Frame.Form'
		,	{
				//	Los atributos seteados en false son opcionales, al setearlos en false puedo preguntar con un condicional.
				defaults:
				{
					type:		false	//	@tipo String		@descripcion Tipo de formulario
				,	data:		[]		//	@tipo Array|Object	@descripcion Campos del formulario
					/*
						Estructura de Data
						1.	Como array de campos
							[
								field1
							,	field2
							,	field3
							,	...		
							]
						2.	Como objeto de columnas
							{
								col1:
								[
									field1
								,	field2
								,	field3
								,	...
								]
							,	...
							}
						//	Estructura de Fields
						{
							label:			@tipo String	@descripcion Texto que figura como label (Edad)
						,	name:			@tipo String	@descripcion Nombre del campo (edad)
						,	type:			@tipo String	@descripcion Tipo de campo (text,checkbox,textarea,select,radio,etc)
						,	validations:	@tipo Array		@descripcion conjunto de validaciones ('integer',function,etc)
						,	class:			@tipo String	@descripcion Clase auxiliar para el campo (edad)
						,	placeholder:	@tipo String	@descripcion Marcado que figurara en el campo (Ingrese la edad)
						,	onChange:		@tipo function	@descripcion Funcion a realizar cuando cambia el valor del campo
						}
					*/
				,	'class':	false	//	@tipo String	@descripcion Clase auxiliar del formulario
				,	id:			false	//	@tipo String	@descripcion Id del formulario
				,	onSubmit:	false	//	@tipo funcion	@descripcion Funcion a ejecutar al submitear el formulario
				,	validations:false	//	@tipo Array		@descripcion Validaciones del formulario	
				}
			}
		,	{
				init: function(element,options)
				{
					//	valida si se instancio sobre un formulario, de forma contraria creo uno.
					this.$form	
					=	element.is('form') ? element : this.createForm()
					/*
						El atributo onsubmit, se ejectua al submitear el formulario, por defecto serializa el form y lo envia.
						Al setearlo de esta manera, evito el comportamiento por defecto y puedo interactuar con el form
						antes de submitearlo yo manualmente.
					*/
					this						
						.$form
							.attr('onsubmit','return false;')
					//	Valido si pase algun tipo de form, si es asi, inserto la clase del tipo de form.
					//	Ver (http://getbootstrap.com/css/#forms) para mas informacion de esas clases
					this	
						.$form
							.addClass(
								options.type
								?	('form-'+options.type)
								:	'form'
							)				
					//	Si pase el atributo id en options, lo seteo
					if	(options.id)
						this
							.$form
								.attr('id',options.id)
					//	Valido si options.data va a definir columnas o campos
					if	(can.isPlainObject(options.data))
						this._render_columns(options.data)
					else
						this._render_fields(options.data)
				}

				// Creo un formulario vacio y lo devuelvo.
			,	createForm: function()
				{
					return	can.$('<form>')
								.appendTo(
									this.element
								)
				}
				//	Crea las columnas y llama a la funcion que renderiza los campos dentro de ella
			,	_render_columns: function(columns)
				{
					//	Seteo la variable de contexto this, en la variable local self para poder utilizarla dentro del can.each
					var	self
					=	this
					//	Creo un div y le pongo la clase row para utilizarlo como grilla dentro del form y lo asigno a la variable local $row
					//	Ver (http://getbootstrap.com/css/#grid)
					var	$row
					=	can.$('<div>')
							.addClass('row')
							.appendTo(
								self.$form
							)
					//	Recorro cada columna
					can.each(
						columns
					,	function(fields,col_name)
						{
							//	Creo un div y lo asigno a la variable local $column del can.each
							//	Le pongo como clase el nombre de la columan 
							//	Le pongo como clase el resultado de getColumnClass definida en el controller
							var $column
							=	can.$('<div>')
									.addClass(col_name)
									.addClass(self.getColumnClass())
									.appendTo(
										$row
									)
							//	Llamo a renderizar los campos dentro de la columa creada
							self._render_fields(fields,$column)
						}
					)
				}
				//	Obtiene la clase a utilizar en la columna, dependiendo del numero de columnas del form.
				//	Ver (http://getbootstrap.com/css/#grid)
			,	getColumnClass: function()
				{
					//	Redondeo al menor la division entre el maximo numero de columnas y la cantidad de columas que pase.
					var n
					=	Math.floor(12/can.objectLength(this.options.data))

					return	'col-xs-'+n+' col-sm-'+n+' col-md-'+n+' col-lg-'+n
				}
			//	Renderiza los campos
			,	_render_fields: function(fields,$where)
				{
					//	Seteo a this en self para usarlo dentro del each
					var self
					=	this

					can.each(
						fields
					,	function(field)
						{
							//	Creo el form group que utiliza bootstrap para ordernar los campos (http://getbootstrap.com/css/#forms)
							//	Lo inserto en $where si esta definido, de forma contraria en this.$form (Si es una columna, $where estara definido)
							var	$formGroup
							=	can.$('<div>')
									.addClass('form-group')
									.appendTo($where ||	self.$form)
							//	Llamo a la funcion que renderiza el campo pasandole como argumento, el campo y el formGroup creado.
							self._render_field(field,$formGroup)
							
						}
					)
				}	
				//	Renderiza el campo
			,	_render_field: function(field,$formGroup)
				{
					//	Seteo una variable con el nombre de controlador, para luego invocarla como si fuese el controlador. Atenti!
					var	fieldControl
					=	this.getFieldFunction(field)
					//	Verifico que el tipo de campo es valido
					if	(can.isFunction(fieldControl)) {
						//	Instancio el controlador dentro de $formGroup
						new	fieldControl(
							$formGroup
						//	Extiendo el objeto field con el atributo type seteando tal atributo igual al type del form
						//	Esto remplazara el type del campo y le permitira al campo saber que estrucutra HTML tomar (http://getbootstrap.com/css/#forms)
						//	Ejemplo, si field.type = 'text', al extenderse quedara field.type = 'form-inline'
						,	can.extend(
								field
							,	{
									type:	this.options.type
								}
							)
						)
					}	else
						//	En caso de que no sea un tipo de campo correcto, doy aviso.
						console.log('Frame.Form: Wrong Field Type '+field.type)
				}
				//	Valida que exista un controlador cuyo nombre concuerde con el tipo de campo
				//	Ejemplo, si field.type = 'text' debe de existir el controlador Frame.Fields.Text 
			,	getFieldFunction: function(field)
				{
					return	eval('Frame.Fields.'+can.capitalize(field.type.toLowerCase()))
				}	
			}
		)
	}
)