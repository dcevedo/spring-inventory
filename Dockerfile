# FROM azul/zulu-openjdk-alpine:11-latest
FROM arm64v8/openjdk:11-jdk-slim-bullseye
RUN addgroup spring
RUN adduser spring --ingroup spring
USER spring:spring
ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT [ "java","-cp","app:app/lib/*","com.practices.inventory.InventoryApplication"]