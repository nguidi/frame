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
	,	'controls/form/fields/button'
	//	Bootstrap Form Validator
	,	'validator/js/bootstrapValidator'
	,	'css!validator/css/bootstrapValidator'
	//	iCheck
	,	'iCheck/icheck'
	,	'css!iCheck/skins/square/blue'
	,	'css!styles/fixes'
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
				,	data:		[]		//	@tipo Array		@descripcion Campos del formulario
					/*
						Estructura de Data
						1.	Como array de campos
							[
								field1
							,	field2
							,	field3
							,	...		
							]
						2.	Como array de campos
							[
								field1
							,	field2
							,	field3
							,	...
							]
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
					/*	Deprecado: Generacion de columnas de campos
					if	(can.isPlainObject(options.data))
						this._render_columns(options.data)
					else
					*/
					//	Armo una lista observable con los campos, es mantener un estado por cada campo
					this.fields
					=	new can.Map()
					//	Bindeo la edicion de this.fields
					this.fields.on('change',can.proxy(this.allFieldRendered,this))
					//	Renderizo los campos
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
			/*	Deprecado: Generacion de columnas de campos
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
			*/
				//	Renderiza los campos
			,	_render_fields: function(fields,$where)
				{
					//	Seteo a this en self para usarlo dentro del each
					var self
					=	this

					can.each(
						fields
					,	function(field,index)
						{
							//	Creo el form group que utiliza bootstrap para ordernar los campos (http://getbootstrap.com/css/#forms)
							//	Lo inserto en $where si esta definido, de forma contraria en this.$form (Si es una columna, $where estara definido)
							var	$formGroup
							=	can.$('<div>')
									.addClass('form-group')
									.appendTo($where ||	self.$form)
							//	Llamo a la funcion que renderiza el campo pasandole como argumento, el campo y el formGroup creado.
							self._render_field(field,$formGroup,index)
							
						}
					)
				}	
				//	Renderiza el campo
			,	_render_field: function(field,$formGroup,index)
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
					//	Aviso que el campo se renderizo
					this.fieldRendered(field.name || index,$formGroup)
				}
				//	Valida que exista un controlador cuyo nombre concuerde con el tipo de campo
				//	Ejemplo, si field.type = 'text' debe de existir el controlador Frame.Fields.Text 
			,	getFieldFunction: function(field)
				{
					return	eval('Frame.Fields.'+can.capitalize(field.type.toLowerCase()))
				}
				//	Actualiza la informacion del campo
			,	fieldRendered: function(fieldName,$element)
				{
					//	Setea que el campo fue renderizado y el elemento del mismo
					this
						.fields
							.attr(
								fieldName
							,	{
									rendered:	true
								,	element:	$element
								}
							)
				}
				//	Verifica si ya se renderizaron todos los campos
			,	allFieldRendered: function(ev, attr, how, newVal, oldVal)
				{
					//	_.keys devuelve las claves del objeto en forma de array
					if	(_.keys(this.fields.attr()).length == this.options.data.length)	{
						//	Inicializo las validaciones
						this._render_validations()
						//	Inicializo iCheck
						this._render_iCheck()
					}
				}
				//	Habilita iCheck (ver https://github.com/fronteed/iCheck)
			,	_render_iCheck: function()
				{
					//	Inicializa iCheck
					this
						.$form
							.find('input[type=checkbox],input[type=radio]')
								.iCheck(
									{
										checkboxClass: 'icheckbox_square-blue'
									,	radioClass: 'iradio_square-blue'
									}
								)
								.on(
									'ifChanged'
								,	function(e)
									{
										can.trigger(
											$(this)
										,	'form.field.validate'
										,	$(this).attr('name')
										)
									}
								)
				}
				//	Habilita las validaciones (ver BootstrapValidations http://bootstrapvalidator.com/)
			,	_render_validations: function()
				{
					//	Utilizo el BootstrapValidator para generar las validaciones
					this
						.$form
							.bootstrapValidator(
								{
									//	Indico campos que seran excluidos de validaciones
									//	Ejemplo Ocultos y Deshabilitados
									excluded:		[':disabled', ':hidden', ':not(:visible)']
									//	Iconos a utilizar para indicar el estado del campo
								,	feedbackIcons:
									{
										valid:		'fa fa-check'
									,	invalid:	'fa fa-times'
									,	validating:	'fa fa-refresh'
									}
									//	Validacion en vivo, 3 letras necesarias para activar la validacion (se puede remplazar por campo)
								,	live:			'enabled'
									//	Selector del boton que envia el submit del formulario
								,	submitButtons:	'button[type="submit"]'
									//	Funcion a llamar al submitear el formulario
								,	submitHandler:	can.proxy(this.submitForm,this)
									//	Validaciones
								,	fields:			this.getValidations()
								}
							)
					//	Obtengo la instancia del validador de campos de bootstrap
					this.formValidator
					=	this.$form.data('bootstrapValidator')
				}
				//	Genera el objeto que necesita el BootstrapValidator para validar los campos
			,	getValidations: function()
				{
					//	Hago que la variable local self sea this para poder utilziarla dentro de can.map
					var	self
					=	this
					//	Itero sobre los atributos de la validaciones
					return	_.mapValues(
								_.cloneDeep(this.options.validations)
							,	function(validations,fieldName)
								{
									//	Itero sobre las opciones de la validaciones
									return	{
												validators:
												_.mapValues(
													validations
												,	function(options,validationName)
													{
														return	_.extend(
																	options
																,	{
																		message: options.message || self.getValidationMessage(validationName,options)
																	}
																)
													}
												)
											}
								}
							)
				}
				//	Objtiene el mensaje segun la validacion
			,	getValidationMessage: function(validationName,options)
				{
					//	Objetos que machea el nombre de la validacion con el mensaje a mostrar
					var	validationMessages
					=	{
							base64:			'El valor ingresado debe contener solo letras y numeros.'
						,	between:		'El valor ingresado no se encuentra entre {min} y {max}.'
						,	choice:			'Debe de seleccionar entre {min} y {max} opciones.'
						,	date:			'El valor ingresado no es una fecha válida.'
						,	diferent:		'El valor ingresado debe ser diferente a {value}.'
						,	digits:			'El valor ingresado no debe ser exacto.'
						,	emailAddress:	'El valor ingresado no es un e-mail válido.'
						,	file:			'El valor ingresado no es un archivo válido.'
						,	greaterThan:	'El valor ingresado debe ser mayor a {value}.'
						,	hex:			'El valor ingresado debe ser hexadecimal.'
						,	hexColor:		'El valor ingresado no es un color válido.'
						,	identical:		'El valor ingresado no coincide con el del campo {value}.'
						,	integer:		'El valor ingresado no es un numero entero.'
						,	lessThan:		'El valor ingreasado no es menor que {value}.'
						,	notEmpty:		'El campo es requerido.'
						,	phone:			'El valor ingresado no es un numero de telefono válido.'
						,	stringCase:		'El valor ingresado debe de estar en '+((options.case == 'lower') ? 'minusculas' : 'mayusculas')+'.'
						,	stringLength:	(options.min && options.max)
											?	'El valor ingresado debe tener un numero de caracteres entre {min} y {max}.'
											:	(options.min)
												?	'El valor ingresado debe tener al menos {min} caracteres.'
												:	'El valor ingresado no puede superar los {max} caracteres.'
						,	uri:			'El valor ingresado no es una dirección válida.'
						}
					//	Retorno la validacion remplazando las variables que corresponden (ver http://canjs.com/docs/can.sub.html)
					return	can.sub(validationMessages[validationName],options)
				}
				//	Evento que fuerza el checeko de validacion de un campo
			,	'form.field.validate': function(el,ev,fieldName)
				{
					//	Tomo la instancia del bootstrapValidator, pongo el campo como no validado y lo valido.
					this
						.formValidator
							.updateStatus(fieldName, 'NOT_VALIDATED', null)
							.validateField(fieldName)
				}
				//	Submitea el formulario
			,	submitForm: function(bootstrapValidator,$form,$button)
				{
					//	Seteo la data del formulario en una variable local
					var	formData
					=	this.getFormData()
					//	Valido si se paso como argumento una funcion para el submit del form
					if	(this.options.onSubmit)	{
						//	Guardo el resultado del submit en una variable local
						var	submited
						=	this.options.onSubmit(formData)
						//	Verifico si el resultado es un deferred
						if	(can.isDeferred(submited))
							submited
								//	Espero que se resuelva y dependiendo del estado llamo a la funcion que corresponde
								.then(
									//	Se resolvio bien
									can.isFunction(this.options.submitSuccess)
									?	this.options.submitSucces
									:	can.proxy(this.submitSuccess,this)
									//	Se resolvio mal
								,	can.isFunction(this.options.submitFailed)
									?	this.options.submitFailed
									:	can.proxy(this.submitFailed,this)
								)
						else
							console.log(submited)
					}	else
						// Imprimo por consola la data del form
						console.log(formData)
				}
				//	Imprime el resultado del success
			,	submitSuccess: function()
				{
					//	Imprimo por consola los argumentos del success
					console.log(arguments)
				}
				//	Imprime el resultado del fail
			,	submitFailed: function()
				{
					//	Imprimo por consola los argumentos del success
					console.log(arguments)
				}
				//	Obtiene los valores del formulario
			,	getFormData: function()
				{
					return	this.$form.serialize()
				}
			}
		)
	}
)