OUTPUT = resume-AronGriffis.html resume-AronGriffis.pdf resume.html

.PHONY: all
all: $(OUTPUT)

.PHONY: clobber
clobber:
	rm -f $(OUTPUT)

%.html: %.odt
	unoconv --doctype=document --format=$(subst .,,$(suffix $@)) $<

%.pdf: %.odt
	unoconv --doctype=document --format=$(subst .,,$(suffix $@)) $<

resume.html: resume-AronGriffis.html resume.xsl Makefile
	xsltproc --html resume.xsl $< | \
	    tidy -q -i -utf8 -wrap 0 > $@ || \
	    { status=$$?; rm -f $@; exit $$status; }
