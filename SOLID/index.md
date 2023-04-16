SOLID

S = Single responsibility, if a class has more than one job, it needs to be refactored and its tasks abstracted out to other class, interfaces or traits.

O = Open for extension, not modification
	In cases when you find the logic is beginning to rot:
	“Seperate extensible behaviours behind an interface, and flip the dependencies.”

	Polymorphism = different behaviour which shares a common interface

L = Liskov principle; any implementation of an abstraction (interface) should be substitutable in any place that the abstraction is accepted. 	
	In other words, every sub class should be substitutable in every place the class was accepted.

I = Interface Segregation
	A client should not be forced to implement an interface that it does not use.
	Sub classes should not be forced to use methods or own properties it does not need.

D = Depend on abstractions, not on concretions, 
	Dependency Inversion not Injection

https://dev.to/evrtrabajo/solid-in-php-d8e
