package ru.kuraecode.networkprogramming.domain

import java.time.LocalDateTime
import java.util.*

data class Msg(
    val id: String = UUID.randomUUID().toString(),
    val content: String = "",
    val sender: String = "SYSTEM",
    val time: LocalDateTime = LocalDateTime.now()
)


