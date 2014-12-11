import	'jquery'
import	'bootstrap/js/bootstrap'
import	'bootstrap/css/bootstrap.css!'
import	'lib/typeahead'

$('[name=paisArray]')
	.typeahead(
		{
			source:	['Argentina', 'Brasil', 'Canada', 'Dinamarca', 'Etopia', 'Francia']
		}
	)