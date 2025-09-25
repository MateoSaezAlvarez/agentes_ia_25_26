#!/bin/bash
# @autor: Mateo SA
# @comment:-
# @description: Script que valida si tenemos instalados: Git, node, npm, curl
# crear un script que utilizando command -v verifique si tengo instalados los paquetes git, node, npm, curl. Si alguno de dichos paquetes no está en el sistema, mostraremos mensaje de error


if command -v git > /dev/null 2>&1; then
	GIT_VERS=$(git --version)
	echo "Git instalado, version: $GIT_VERS"
else
	echo "Error: git no está instalado"
	exit 1
fi


if command -v node > /dev/null 2>&1; then
	NODE_VERS=$(node --version)
	echo "Node instalado, version: $NODE_VERS"
else
	echo "Error: node no instalado"
	exit 1
fi


if command -v npm > /dev/null 2>&1; then
	NPM_VERS=$(npm --version)
	echo "npm instalado, version $NPM_VERS"
else
	echo "No está instalado"
	exit 1
fi

if command -v curl > /dev/null 2>&1; then
	echo "Curl instalado"
else
	echo "Curl no está instalado"
	exit 1
fi

echo "Todos los paquetes instalados"
