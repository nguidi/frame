require
	.config(
		{
			map:
			{
				'*':
				{
					'css':	'bower_components/require-css/css'
				} 
			}
		,   paths:
			{
				'jquery':				'bower_components/jquery/dist/jquery.min'
			,	'can':					'bower_components/canjs/amd/can'
			,	'bootstrap':			'bower_components/bootstrap/dist'
			,	'fontawesome':			'bower_components/fontawesome'
			,	'localstorage':			'bower_components/canjs-localstorage/can.localstorage'
			,	'typeahead':			'bower_components/typeahead/bootstrap3-typeahead'
			,	'lodash':				'bower_components/lodash/dist/lodash'	
			,	'draggabilly':			'bower_components/draggabilly/draggabilly'
			//	Start Draggabilly Dependencies
			,	'classie':				'bower_components/classie'
			,	'eventie':				'bower_components/eventie'
			,	'get-style-property':	'bower_components/get-style-property'
			,	'eventEmitter':			'bower_components/eventEmitter'
			,	'get-size':				'bower_components/get-size'
			//	End
			,	'datetimepicker':		'bower_components/bootstrap3-datetimepicker'
			//	Start DateTimerPicker Dependencies
			,	'moment':				'bower_components/moment/moment'
			,	'time-locale-es':		'bower_components/bootstrap3-datetimepicker/src/js/locales/bootstrap-datetimepicker.es'
			//	END
			}
		,	shim:
			{
				'can':			['jquery']
			,	'bootstrap':	['jquery']
			,	'typeahead':	['jquery']
			}
		}
	)