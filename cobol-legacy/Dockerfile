# Use uma imagem Debian e instale o GnuCOBOL
FROM debian:stable-slim

RUN apt-get update && \
    apt-get install -y gnucobol && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . /app
RUN cobc -x -o todoapp todoapp.cbl
CMD ["./todoapp"]
