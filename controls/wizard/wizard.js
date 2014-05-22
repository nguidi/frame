define(
	[
	'lib/util'
,	'lib/styles'
	]
,	function()
	{
		can.Control(
			'Frame.Wizard'
		,	{
				defaults: {
					view:	'',
					data: {},
					key: '',
					initial: true
				}
			}
		,	{

				init: function (element, options){
					
					this.wizardLIFO = new can.List([])

					this.loadStep()

				}


			,	'.btnstep click': function(el,ev){
					
					can.trigger(
						this.element
					,	'frame.step.b'
					)	

				}

			,	'.btnnext click': function(el,ev){
					
					this.loadStep()	
				}

			,	'.btnback click': function(el,ev){

					can.extend(this.options, this.wizardLIFO.attr(0))
					
					this.loadStep()	
				}

			,	loadStep: function(){

					this.wizardLIFO.push(this.options)

					can.$('.step').remove()

					can.append(
						this.element
					,	can.view(
							this.options.view
						,	this.options.data
						)
					)

					if ( this.options.initial == true ) {
						$('.btnback').hide()
					} else {
						$('.btnback').show()	
					}

					$('.btnnext').hide()
				}

			, 	'frame.step.b': function(){

					var nextStep = {
						view:	'views/wizard/wizard.mustache',
						data: 	{ wizard_title: 'Paso 2' },
						key: 'B',
						initial: false
					}

					can.extend(this.options, nextStep)

					$('.btnnext').show()

				}
			}
		)	
	}
)