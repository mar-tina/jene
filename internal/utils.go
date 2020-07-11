package internal

import "bytes"

type Transactions interface {
	Commit(buf *bytes.Buffer) error
}
