define(
	[
	'lib/util'
,	'lib/styles'
,	'css!controls/wizard/wizard'
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
					can.append( this.element, 
						can.view(
							this.options.view))
					

					this.wizardLIFO = new can.List([])

					this.wizardData = new can.Map({})

					this.wizardLIFO.bind(
						'add'
					,	can.proxy(this._render_next_step,this)
					)

					this.wizardLIFO.bind(
						'remove'
					,	can.proxy(this._render_prev_step,this)
					)
					var primerPaso = this.findPrimerPaso()

					this.wizardLIFO.push(primerPaso)
				}

			, 	findPrimerPaso: function(){
					var initialSteps = can.grep(this.options.steps, function(step, i){ return step.initial })
					return initialSteps.shift()
				}

			, 	_render_next_step: function(event, steps, index){
						
						var step = steps.shift()

						var $li = can.$('<li>')
						$li.addClass('active')
						var $a = can.$('<a>')
						$a.html(step.title)

						$li.append($a)
						
						this.element.find('.nav-wizard li.active').removeClass('active')

						$li.insertBefore(
							this.element.find('.nav-wizard li:last')
							)

						this.generarContenido(step)

						this.wizardData.attr(step.key, {})



				}
			, 	_render_prev_step: function(event, steps, index){

					var prevElem = this.element.find('.nav-wizard li.active').prev()
					prevElem.addClass('active')

					prevElem.next().remove()

					var step = this.wizardLIFO.attr(index -1)
					this.generarContenido(step)

				}

			,	generarContenido: function(step) {

						var $content = this.element.find('.panel-body').empty()

						var $div2 = can.$('<div>')
						new step.control($div2, {}, {})

						$div2.appendTo($content)

						this.element.find('.btnnext').attr('disabled', true)
						
						if (step.initial) {
							this.element.find('.btnback').attr('disabled', true)
						} else {
							this.element.find('.btnback').attr('disabled', false)	
						}

						if (step.final){
							this.element.find('.btnnext').html('finalizar')
						}

			}
			,	'frame.wizard.next': function(el,ev,options)
				{
					this.options.nextStep = can.grep(this.options.steps, function(step, i){ return step.key ==  stepKey}).shift()
				
					this.element.find('.btnnext').attr('disabled',false)
				}

			,	'.btnnext click': function(el,ev){
					this.wizardLIFO.push(this.options.nextStep)
				}
				
			,	'.btnback click': function(el,ev){
					this.wizardLIFO.pop()
				}

				/*

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

					this.element.find('.nav-wizard')
						.prepend(
								can.$('<li>')
							)
						var $li = can.$('<li>')
						$li.addClass('active')
						var $a = can.$('<a>')
						$a.html
					can.append(
						this.element
					,	can.view(
							this.options.view
						,	this.options.data
						)
					)
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
				*/
			}
		)	
	}
)