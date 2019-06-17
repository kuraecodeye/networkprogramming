package ru.kuraecode.networkprogramming.web

import ru.kuraecode.networkprogramming.domain.Msg
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


data class MsgDto(
    var content: String? = "",
    var sender: String? = "SYSTEM",
    var time: String = LocalDateTime.now().format(pattern)
) {
    constructor(message: Msg): this(content = message.content, sender= message.sender, time = message.time.format(pattern))

    companion object {
        val pattern: DateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss")
    }
}
