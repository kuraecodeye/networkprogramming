FROM openjdk:8-jre-alpine


EXPOSE 8080

ENTRYPOINT ["/usr/bin/java", "-jar", "/usr/share/network/networkprogrammin.jar"]

ADD build/libs/networkprogramming-kotlin-all-1.0-SNAPSHOT.jar "/usr/share/network/networkprogrammin.jar"
