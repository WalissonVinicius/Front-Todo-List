import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Definindo a interface para o tipo de tarefa
interface Task {
    title: string;
    about: string;
}

const ToDoListScreen: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [about, setAbout] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);

    // Função para adicionar tarefas
    const handleAddTask = (): void => {
        if (title && about) {
            setTasks([...tasks, { title, about }]);
            setTitle('');
            setAbout('');
        }
    };

    // Função para remover tarefas
    const handleRemoveTask = (index: number): void => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <View style={styles.container}>
            {/* Campos de entrada e Botão de Adicionar */}
            <View style={styles.inputContainer}>
                <View style={styles.textInputs}>
                    <TextInput
                        style={styles.input}
                        placeholder="Title..."
                        placeholderTextColor="#F0E3CA"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="About..."
                        placeholderTextColor="#F0E3CA"
                        value={about}
                        onChangeText={setAbout}
                    />
                </View>
                {/* Botão de Adicionar */}
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Adicionando ScrollView para rolagem */}
            <ScrollView style={styles.scrollView}>
                {tasks.length === 0 ? (
                    <View style={styles.noTaskContainer}>
                        <View style={styles.noTaskUnderline}></View>
                        <Text style={styles.noTaskText}>No tasks </Text>
                        <View style={styles.noTaskUnderline}></View>
                    </View>
                ) : (
                    tasks.map((task, index) => (
                        <View key={index} style={styles.taskItem}>
                            <View style={styles.taskTextContainer}>
                                <Text style={styles.taskTitle}>{task.title}</Text>
                                <Text style={styles.taskAbout}>{task.about}</Text>
                            </View>
                            {/* Botão de Remover Tarefa */}
                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveTask(index)}>
                                <Text style={styles.removeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        padding: 20,
        paddingTop: 60,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    textInputs: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        backgroundColor: '#333333',
        color: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FF7F00',
    },
    addButton: {
        backgroundColor: '#1A1A1A',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FF7F00',
    },
    addButtonText: {
        fontSize: 40,
        color: '#FF7F00',
    },
    scrollView: {
        flex: 1,
    },
    noTaskContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    noTaskText: {
        color: '#F0E3CA',
        fontSize: 20,
        alignItems: 'center',
    },
    noTaskUnderline: {
        width: 60,
        height: 2,
        backgroundColor: '#FF7F00',
        marginTop: 5,
    },
    taskItem: {
        flexDirection: 'row', // Exibe título e botão "X" lado a lado
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FF7F00',
        alignItems: 'center', // Centraliza os itens verticalmente
    },
    taskTextContainer: {
        flex: 1, // Garante que o texto ocupe o espaço disponível
    },
    taskTitle: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    taskAbout: {
        color: '#AAAAAA',
        fontSize: 14,
    },
    removeButton: {
        backgroundColor: '#2B2A27',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#A35709',
        borderWidth: 3,
    },
    removeButtonText: {
        color: '#FF8303',
        fontSize: 18,
    },
});

export default ToDoListScreen;
