<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="4.01"/>

  <xsl:template match="html">
    <html>
      <xsl:apply-templates/>
    </html>
  </xsl:template>

  <xsl:template match="head">
    <head>
      <xsl:copy-of select="meta"/>
      <title>Resume - Aron Griffis</title>
      <link href="/static/main.css" type="text/css" rel="stylesheet"/>
    </head>
  </xsl:template>

  <xsl:template match="body">
    <body class="resume">
      <xsl:copy-of select="@*"/>
      <div class="container">
        <xsl:apply-templates select="p|ul"/>
      </div>
    </body>
  </xsl:template>

  <xsl:template match="p[1]">
    <xsl:call-template name="heading">
      <xsl:with-param name="text"><xsl:value-of select="."/></xsl:with-param>
      <xsl:with-param name="leftdiv">resume-title</xsl:with-param>
      <xsl:with-param name="lefttag">h1</xsl:with-param>
      <xsl:with-param name="rightdiv">resume-contact</xsl:with-param>
      <xsl:with-param name="righttag">p</xsl:with-param>
    </xsl:call-template>
  </xsl:template>

  <xsl:template match="p[position()>1]">
    <xsl:variable name="size">
      <xsl:value-of select=".//font[@face='Ubuntu']//font/@size"/>
    </xsl:variable>
    <xsl:variable name="class">
      <xsl:value-of select="@class"/>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$size=4">
        <xsl:call-template name="heading">
          <xsl:with-param name="text"><xsl:value-of select="."/></xsl:with-param>
          <xsl:with-param name="leftdiv">resume-section</xsl:with-param>
          <xsl:with-param name="lefttag">h2</xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="$size=2">
        <xsl:call-template name="heading">
          <xsl:with-param name="text"><xsl:value-of select="."/></xsl:with-param>
          <xsl:with-param name="leftdiv">resume-position</xsl:with-param>
          <xsl:with-param name="lefttag">h3</xsl:with-param>
          <xsl:with-param name="rightdiv">resume-date</xsl:with-param>
          <xsl:with-param name="righttag">h3</xsl:with-param>
        </xsl:call-template>
      </xsl:when>
      <xsl:when test="$class='resume-body-western'">
        <p class="resume-body">
          <xsl:value-of select="normalize-space()"/>
        </p>
      </xsl:when>
      <xsl:otherwise>
        <xsl:message terminate="yes">Error: font size=<xsl:value-of select="$size"/>: <xsl:copy-of select="."/></xsl:message>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="ul">
    <ul class="resume-bullet">
      <xsl:for-each select="p">
        <li><xsl:value-of select="normalize-space()"/></li>
      </xsl:for-each>
    </ul>
  </xsl:template>

  <xsl:template name="heading">
    <xsl:param name="text"/>
    <xsl:param name="leftdiv"/>
    <xsl:param name="lefttag"/>
    <xsl:param name="rightdiv" select="false()"/>
    <xsl:param name="righttag" select="false()"/>

    <xsl:variable name="lefttext">
      <xsl:choose>
        <xsl:when test="contains($text, '&#9;')">
          <xsl:value-of select="normalize-space(substring-before($text, '&#9;'))"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="normalize-space($text)"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="righttext">
      <xsl:if test="contains($text, '&#9;')">
        <xsl:value-of select="normalize-space(substring-after($text, '&#9;'))"/>
        <xsl:if test="$rightdiv=false()">
          <xsl:message terminate="yes">Assertion error: Split heading without rightdiv</xsl:message>
        </xsl:if>
      </xsl:if>
    </xsl:variable>

    <div>
      <xsl:attribute name="class"><xsl:value-of select="$leftdiv"/></xsl:attribute>
      <xsl:element name="{$lefttag}"><xsl:value-of select="$lefttext"/></xsl:element>
    </div>

    <xsl:if test="$righttext!=''">
      <div>
        <xsl:attribute name="class"><xsl:value-of select="$rightdiv"/></xsl:attribute>
        <xsl:element name="{$righttag}"><xsl:value-of select="$righttext"/></xsl:element>
      </div>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
