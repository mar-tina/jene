// The following directive is necessary to make the package coherent:

// +build ignore

// This program generates contributors.go. It can be invoked by running
// go generate
package main

var BuildJene JeneInterface

func main() {
	InstantiateBuilder("trying.go", "trying")
	var Oceans = []string{
		"Arctic",
		"Southen",
		"Indian",
		"Atlantic",
		"Pacific",
	}

	var randos = []int{1, 2, 3, 4, 5, 6, 7, 8}

	BuildJene.SliceNewWithContent("oceans", "string", Oceans)
	BuildJene.SliceNewWithContent("randos", "int", randos)
}

func InstantiateBuilder(filename string, pkg string) {
	BuildJene = &JeneBuilder{}
	BuildJene.Open(filename, pkg)
}
