package internal

import "bytes"

type Transaction interface {
	Commit(buf *bytes.Buffer) error
}
