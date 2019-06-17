package ru.kuraecode.networkprogramming

import io.javalin.Javalin
import io.javalin.plugin.json.JavalinJson
import io.javalin.websocket.WsContext

import ru.kuraecode.networkprogramming.domain.Msg
import ru.kuraecode.networkprogramming.web.MsgDto
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

fun main() {

    val sessions = ConcurrentHashMap.newKeySet<WsContext>()
    val messages = Collections.synchronizedList(mutableListOf<Msg>())

    val app = Javalin.create {
        it.addStaticFiles("/public")
    }.apply {
        ws("/app/chat") {
                wsHandler ->
            wsHandler.onConnect { ctx ->
                sessions.add(ctx)
                sessions.forEach { it.send(JavalinJson.toJson(MsgDto(content = "New user was connected", sender = "SYSTEM"))) }
                messages.forEach { ctx.send(MsgDto(it)) }
            }
            wsHandler.onMessage { ctx ->
                val message = JavalinJson.fromJson(ctx.message(), MsgDto::class.java)
                if (message.content != null && message.sender != null) {
                    val msg = Msg(content = message.content!!, sender = message.sender!!, time = LocalDateTime.now())
                    messages.add(msg)
                    sessions
                        .filter { it.session.isOpen }
                        .forEach { it.send(MsgDto(msg)) }
                }

            }
            wsHandler.onClose { ctx ->

                sessions.remove(ctx)
                sessions.forEach { it.send(JavalinJson.toJson(MsgDto(content = "User was disconnected", sender = "SYSTEM"))) }
            }

        }
    }


    app.start(8080)
}
