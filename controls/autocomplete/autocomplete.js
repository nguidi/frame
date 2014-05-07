define(
[
	'lib/util'
,	'lib/styles'
]
,	function() {
		can.Control('Frame.Autocomplete'
		, {
			defaults: {
				view: 'views/autocomplete/init.mustache'
			,	view_data:
					{
						input_name: 'autocomplete'
					,	button_label: 'Buscar!'
					}
			}
		} ,	{
			init: function() {
				can.append(
					this.element
					,	can.view(
							this.options.view
						,	this.options.view_data
					)
				)
			}

		,	show: function(list) {
				var	$menu =	this.element.find('ul.dropdown-menu')
					
				$menu.empty()

				can.each( list
				,	function(value, index) {
						can.append(
							$menu
						,	can.$('<li>').text( value )
						)
					}
				)

				$menu.show()

			}

		,	hide: function() {
				this.element.find('ul.dropdown-menu').hide()

			}

		,	search: function(toSearch) {
				if	(can.isArray(this.options.data)) {
					var	list = (toSearch.length == 0)
							?	[]
							:	can.grep(
									this.options.data
								,	function(value,index) {
										return	value.toLowerCase().indexOf(toSearch.toLowerCase()) != -1
									}
							)
						
						if	(list.length == 0)
							this.hide()
						else
							this.show(list)
					} else
						this.searchAsync(toSearch)
				}

		,	searchAsync: function(toSearch) {
				if	(can.isFunction(this.options.data))
					this.options.data(toSearch).then(
						can.proxy(this.show,this)
					,	can.proxy(this.hide,this)
					)
			}

		,	validate: function(toSearch){
				if	(toSearch.length >= 3)
					this.search(toSearch)

			}

		,	'input.autocomplete keyup': function(input,event) {
				switch(event.keyCode) {
					case 13: //	Aprete Enter
						this.search(can.$(input).val())
						break;

					case 8: //	borre
						this.search(can.$(input).val())
						break;

					default: //	de forma contraria
						this.validate(can.$(input).val())
						break;
					}
			}
		})
	}
)