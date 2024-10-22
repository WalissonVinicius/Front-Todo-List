import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; // Ícones adicionais

interface Task {
    title: string;
    about: string;
}

const ToDoListScreen: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [about, setAbout] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null); // Controla tarefa ativa
    const [isShareMenuVisible, setIsShareMenuVisible] = useState<boolean>(false); // Controla menu global de compartilhamento
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false); // Controla o modal de exclusão
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null); // Índice da tarefa a ser deletada

    // Função para adicionar tarefas
    const handleAddTask = (): void => {
        if (title && about) {
            setTasks([...tasks, { title, about }]);
            setTitle('');
            setAbout('');
        }
    };

    // Função para remover tarefas
    const handleConfirmDeleteTask = (): void => {
        if (taskToDelete !== null) {
            const updatedTasks = tasks.filter((_, i) => i !== taskToDelete);
            setTasks(updatedTasks);
            setIsDeleteModalVisible(false); // Fechar o modal após deletar
        }
    };

    // Abrir modal para confirmar a exclusão
    const handleRemoveTask = (index: number): void => {
        setTaskToDelete(index);
        setIsDeleteModalVisible(true); // Exibir o modal de confirmação
    };

    // Alternar tarefa ativa
    const handleToggleTask = (index: number): void => {
        setActiveTaskIndex(index === activeTaskIndex ? null : index);
    };

    // Alternar menu de compartilhamento
    const handleToggleShareMenu = (): void => {
        setIsShareMenuVisible(!isShareMenuVisible);
    };

    return (
        <View style={styles.container}>
            {/* Campos de entrada e botão de adicionar */}
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
                <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de tarefas */}
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
                            <TouchableOpacity
                                style={styles.taskContent}
                                onPress={() => handleToggleTask(index)}
                            >
                                <View style={styles.taskTextContainer}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Text style={styles.taskAbout}>{task.about}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => handleRemoveTask(index)}
                                >
                                    <Text style={styles.removeButtonText}>X</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>

                            {/* Ícones de ação */}
                            {activeTaskIndex === index && (
                                <View style={styles.actionIcons}>
                                    <TouchableOpacity onPress={handleToggleShareMenu}>
                                        <Ionicons
                                            name="share-social"
                                            size={24}
                                            color="#FF8303"
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="information-circle"
                                            size={24}
                                            color="#FF8303"
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="create"
                                            size={24}
                                            color="#FF8303"
                                            style={styles.icon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Modal de confirmação de exclusão */}
            <Modal
                visible={isDeleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Delete this task? </Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleConfirmDeleteTask}
                            >
                                <Text style={styles.modalButtonText}>Yes </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setIsDeleteModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Menu de compartilhamento no final da tela */}
            {isShareMenuVisible && (
                <View style={styles.shareMenu}>
                    <TouchableOpacity style={styles.shareIcon}>
                        <Ionicons name="copy" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="vk" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="telegram" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="whatsapp" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareIcon}>
                        <FontAwesome name="facebook" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}
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
    },
    noTaskUnderline: {
        width: 60,
        height: 2,
        backgroundColor: '#FF7F00',
        marginTop: 5,
    },
    taskItem: {
        marginBottom: 10,
    },
    taskContent: {
        flexDirection: 'row',
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FF7F00',
        alignItems: 'center',
    },
    taskTextContainer: {
        flex: 1,
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
    actionIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        backgroundColor: '#1A1A1A',
        padding: 10,
        borderRadius: 5,
        borderColor: '#FF7F00',
        borderWidth: 1,
    },
    shareMenu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#333333',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    shareIcon: {
        marginHorizontal: 10,
    },
    icon: {
        marginHorizontal: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#333333',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FF8303',
        padding: 10,
        borderRadius: 5,
        width: '35%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    modalButtonText: {
        color: '#FF8303',
        fontSize: 16,
    },
});

export default ToDoListScreen;
