package internal

import "log"

func BuildFile(tree [][]string) {
	for _, arg := range tree {
		log.Printf("The args %v", arg[0])
	}
}
