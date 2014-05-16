define(
	[
		'lib/util'
	,	'datetimepicker/build/js/bootstrap-datetimepicker.min'
	,	'css!datetimepicker/build/css/bootstrap-datetimepicker.min'
	,	'time-locale-es'
	]
,	function()
	{
		/*
			@nombre
			Frame.Autocomplete
			
			@descripción

			Manejo de un Autocomplete, Utiliza un plugin externo. typeahead.js
			
			@utilización

			Se debe instanciar el controlador en un input.
		*/

		can.Control(
			'Frame.DateTimePicker'
		,	{
				defaults:
				{
					pickDate:			true
				,	pickTime:			true
				,	useMinutes:			true
				,	useSeconds:			false
				,	useCurrent:			true
				,	minuteStepping:		1
				,	minDate:			new moment({ y: 1900 })
				,	maxDate:			new moment().add(100, "y")
				,	showToday:			true
				,	language:			'es'
				,	defaultDate:		""
				,	disabledDates:		false
				,	enabledDates:		false
				,	icons:
					{
						time:			'fa fa-clock-o'
					,	date:			'fa fa-calendar'
					,	up:				'fa fa-chevron-up'
					,	down:			'fa fa-chevron-down'
					}
				,	useStrict:			false
				,	sideBySide:			false
				,	daysOfWeekDisabled:	false 
				}
			}
		,	{
				init: function()
				{
					//	Instancio el plugin filtrando las opciones dentro de element.
					this
						.element
							.datetimepicker(
								//	La funcion pick de lodash (http://lodash.com/docs) crea un objeto partiendo de options y selecciona solo los atributos dentro del array
								_.pick(
									this.options
								,	[
										'pickDate'
									,	'pickTime'
									,	'useMinutes'
									,	'useSeconds'
									,	'useCurrent'
									,	'minuteStepping'
									,	'minDate'
									,	'maxDate'
									,	'showToday'
									,	'language'
									,	'defaultDate'
									,	'disabledDates'
									,	'enabledDates'
									,	'icons'
									,	'useStrict'
									,	'sideBySide'
									,	'daysOfWeekDisabled'
									]
								)
							)
				}
			}
		)
	}
)